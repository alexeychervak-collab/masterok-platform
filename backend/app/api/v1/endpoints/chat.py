"""
Chat API endpoints
Real-time messaging between clients and specialists via HTTP + WebSocket
"""

from uuid import uuid4
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from sqlalchemy import select, or_, and_, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import logging

from app.db.session import get_db, AsyncSessionLocal
from app.core.security import get_current_user_id, decode_token
from app.models.chat_message import ChatMessage, MessageType
from app.models.user import User

router = APIRouter()
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Active WebSocket connections (in-memory)
# {chat_id: {user_id: websocket}}
# ---------------------------------------------------------------------------
active_connections: dict[str, dict[str, WebSocket]] = {}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_chat_id(user1_id: str, user2_id: str) -> str:
    """Generate a deterministic chat_id from two participant IDs."""
    ids = sorted([user1_id, user2_id])
    return f"{ids[0]}_{ids[1]}"


def parse_chat_participants(chat_id: str) -> tuple[str, str]:
    """Extract two participant IDs from a chat_id."""
    parts = chat_id.split("_", 1)
    if len(parts) != 2:
        raise ValueError("Invalid chat_id format")
    return parts[0], parts[1]


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class SendMessageRequest(BaseModel):
    receiver_id: str
    text: str
    order_id: Optional[str] = None
    message_type: str = "text"


class MessageResponse(BaseModel):
    id: str
    chat_id: str
    sender_id: str
    receiver_id: str
    text: str
    message_type: str
    order_id: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    chat_id: str
    other_user_id: str
    other_user_name: str
    other_user_avatar: Optional[str] = None
    last_message: str
    last_message_time: datetime
    unread_count: int


# ---------------------------------------------------------------------------
# HTTP Endpoints
# ---------------------------------------------------------------------------

@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """
    List all conversations for the current user.

    Returns unique chat_ids with the other participant's info,
    last message preview, and unread count. Sorted by last message time desc.
    """
    # Fetch all distinct chat_ids where the user is a participant
    chat_ids_query = (
        select(ChatMessage.chat_id)
        .where(
            or_(
                ChatMessage.sender_id == user_id,
                ChatMessage.receiver_id == user_id,
            )
        )
        .distinct()
    )
    result = await db.execute(chat_ids_query)
    chat_ids = [row[0] for row in result.all()]

    conversations = []

    for chat_id in chat_ids:
        # Get the last message in this conversation
        last_msg_query = (
            select(ChatMessage)
            .where(ChatMessage.chat_id == chat_id)
            .order_by(desc(ChatMessage.created_at))
            .limit(1)
        )
        last_msg_result = await db.execute(last_msg_query)
        last_msg = last_msg_result.scalar_one_or_none()

        if not last_msg:
            continue

        # Determine the other participant
        other_user_id = (
            last_msg.receiver_id
            if last_msg.sender_id == user_id
            else last_msg.sender_id
        )

        # If both sender and receiver are the same chat, pick correctly
        # by checking all messages in the chat
        if other_user_id == user_id:
            # Edge case: find the actual other user from any message in this chat
            other_query = (
                select(ChatMessage.sender_id, ChatMessage.receiver_id)
                .where(ChatMessage.chat_id == chat_id)
                .limit(1)
            )
            other_result = await db.execute(other_query)
            row = other_result.first()
            if row:
                other_user_id = row[1] if row[0] == user_id else row[0]

        # Fetch the other user's profile
        user_query = select(User).where(User.id == other_user_id)
        user_result = await db.execute(user_query)
        other_user = user_result.scalar_one_or_none()

        # Count unread messages (messages sent TO the current user that are not read)
        unread_query = (
            select(func.count(ChatMessage.id))
            .where(
                and_(
                    ChatMessage.chat_id == chat_id,
                    ChatMessage.receiver_id == user_id,
                    ChatMessage.is_read == False,
                )
            )
        )
        unread_result = await db.execute(unread_query)
        unread_count = unread_result.scalar() or 0

        conversations.append(
            ConversationResponse(
                chat_id=chat_id,
                other_user_id=other_user_id,
                other_user_name=other_user.name if other_user else "Unknown",
                other_user_avatar=other_user.avatar if other_user else None,
                last_message=last_msg.text,
                last_message_time=last_msg.created_at,
                unread_count=unread_count,
            )
        )

    # Sort by last message time descending
    conversations.sort(key=lambda c: c.last_message_time, reverse=True)

    return conversations


@router.get("/history/{chat_id}", response_model=List[MessageResponse])
async def get_chat_history(
    chat_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Get message history for a specific chat.

    The current user must be a participant. Messages are returned
    sorted by created_at ascending (oldest first). Also marks all
    received messages as read.
    """
    # Verify the user is a participant in this chat
    try:
        participant_a, participant_b = parse_chat_participants(chat_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid chat_id format")

    if user_id not in (participant_a, participant_b):
        raise HTTPException(status_code=403, detail="You are not a participant in this chat")

    # Fetch messages with pagination
    messages_query = (
        select(ChatMessage)
        .where(ChatMessage.chat_id == chat_id)
        .order_by(ChatMessage.created_at.asc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(messages_query)
    messages = result.scalars().all()

    # Mark received messages as read
    unread_query = (
        select(ChatMessage)
        .where(
            and_(
                ChatMessage.chat_id == chat_id,
                ChatMessage.receiver_id == user_id,
                ChatMessage.is_read == False,
            )
        )
    )
    unread_result = await db.execute(unread_query)
    unread_messages = unread_result.scalars().all()

    for msg in unread_messages:
        msg.is_read = True

    await db.flush()

    return [
        MessageResponse(
            id=msg.id,
            chat_id=msg.chat_id,
            sender_id=msg.sender_id,
            receiver_id=msg.receiver_id,
            text=msg.text,
            message_type=msg.message_type.value if isinstance(msg.message_type, MessageType) else msg.message_type,
            order_id=msg.order_id,
            is_read=msg.is_read,
            created_at=msg.created_at,
        )
        for msg in messages
    ]


@router.post("/messages", response_model=MessageResponse)
async def send_message(
    request: SendMessageRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Send a new message to another user.

    Generates a deterministic chat_id from sorted participant IDs
    so that both sides always share the same conversation.
    """
    # Verify the sender exists
    result = await db.execute(select(User).where(User.id == user_id))
    sender = result.scalar_one_or_none()
    if not sender:
        raise HTTPException(status_code=401, detail="User not found")

    # Verify the receiver exists
    result = await db.execute(select(User).where(User.id == request.receiver_id))
    receiver = result.scalar_one_or_none()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")

    # Prevent sending messages to yourself
    if user_id == request.receiver_id:
        raise HTTPException(status_code=400, detail="Cannot send a message to yourself")

    # Resolve message type
    try:
        msg_type = MessageType(request.message_type)
    except ValueError:
        msg_type = MessageType.TEXT

    # Generate the chat_id
    chat_id = get_chat_id(user_id, request.receiver_id)

    # Create the message
    message = ChatMessage(
        id=str(uuid4()),
        chat_id=chat_id,
        sender_id=user_id,
        receiver_id=request.receiver_id,
        text=request.text,
        message_type=msg_type,
        order_id=request.order_id,
        is_read=False,
    )
    db.add(message)
    await db.flush()

    log.info(f"Message sent: {message.id} in chat {chat_id}")

    return MessageResponse(
        id=message.id,
        chat_id=message.chat_id,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        text=message.text,
        message_type=msg_type.value,
        order_id=message.order_id,
        is_read=message.is_read,
        created_at=message.created_at,
    )


# ---------------------------------------------------------------------------
# WebSocket Endpoint
# ---------------------------------------------------------------------------

@router.websocket("/ws/{chat_id}")
async def websocket_chat(
    websocket: WebSocket,
    chat_id: str,
    token: str = Query(...),
):
    """
    Real-time chat via WebSocket.

    Connect: ws://host/ws/chat/{chat_id}?token=<jwt>

    On connect:
      - Validates the JWT token
      - Checks the user is a participant in this chat
      - Registers the connection

    On message (JSON):
      - Saves the message to the DB
      - Broadcasts to the other participant if connected

    On disconnect:
      - Removes the connection from active_connections
    """
    # --- Authenticate ---
    payload = decode_token(token)
    if payload is None:
        await websocket.close(code=4001, reason="Invalid token")
        return

    ws_user_id: str = payload.get("sub")
    if ws_user_id is None:
        await websocket.close(code=4001, reason="Invalid token")
        return

    # --- Verify participant ---
    try:
        participant_a, participant_b = parse_chat_participants(chat_id)
    except ValueError:
        await websocket.close(code=4002, reason="Invalid chat_id")
        return

    if ws_user_id not in (participant_a, participant_b):
        await websocket.close(code=4003, reason="Not a participant")
        return

    # --- Accept the connection ---
    await websocket.accept()

    # Register in active connections
    if chat_id not in active_connections:
        active_connections[chat_id] = {}
    active_connections[chat_id][ws_user_id] = websocket

    other_user_id = participant_b if ws_user_id == participant_a else participant_a

    log.info(f"WebSocket connected: user {ws_user_id} in chat {chat_id}")

    try:
        while True:
            data = await websocket.receive_json()

            text = data.get("text", "").strip()
            if not text:
                continue

            order_id = data.get("order_id")
            message_type_str = data.get("message_type", "text")
            try:
                msg_type = MessageType(message_type_str)
            except ValueError:
                msg_type = MessageType.TEXT

            # Save the message to the database
            async with AsyncSessionLocal() as db:
                message = ChatMessage(
                    id=str(uuid4()),
                    chat_id=chat_id,
                    sender_id=ws_user_id,
                    receiver_id=other_user_id,
                    text=text,
                    message_type=msg_type,
                    order_id=order_id,
                    is_read=False,
                )
                db.add(message)
                await db.commit()

                response_data = {
                    "id": message.id,
                    "chat_id": chat_id,
                    "sender_id": ws_user_id,
                    "receiver_id": other_user_id,
                    "text": text,
                    "message_type": msg_type.value,
                    "order_id": order_id,
                    "is_read": False,
                    "created_at": message.created_at.isoformat() if message.created_at else datetime.utcnow().isoformat(),
                }

            # Send confirmation back to the sender
            await websocket.send_json(response_data)

            # Broadcast to the other participant if they are connected
            other_ws = active_connections.get(chat_id, {}).get(other_user_id)
            if other_ws:
                try:
                    await other_ws.send_json(response_data)
                except Exception:
                    # Other connection is stale, clean it up
                    active_connections.get(chat_id, {}).pop(other_user_id, None)

    except WebSocketDisconnect:
        log.info(f"WebSocket disconnected: user {ws_user_id} from chat {chat_id}")
    except Exception as e:
        log.error(f"WebSocket error in chat {chat_id}: {str(e)}", exc_info=True)
    finally:
        # Remove from active connections
        if chat_id in active_connections:
            active_connections[chat_id].pop(ws_user_id, None)
            if not active_connections[chat_id]:
                del active_connections[chat_id]
