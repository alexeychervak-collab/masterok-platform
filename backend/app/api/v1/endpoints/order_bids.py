from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime
from uuid import uuid4
from pydantic import BaseModel

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.models.order import Order, OrderStatus
from app.models.order_bid import OrderBid, BidStatus
from app.models.specialist import Specialist
from app.models.user import User

router = APIRouter()


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class BidCreateRequest(BaseModel):
    price: float
    timeline: Optional[str] = None
    message: Optional[str] = None


class SpecialistInfo(BaseModel):
    id: str
    title: str
    city: str
    rating: float
    review_count: int
    completed_orders: int
    is_verified: bool
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None

    class Config:
        from_attributes = True


class BidResponse(BaseModel):
    id: str
    order_id: str
    specialist_id: str
    price: float
    timeline: Optional[str]
    message: Optional[str]
    status: BidStatus
    created_at: datetime

    specialist: Optional[SpecialistInfo] = None

    class Config:
        from_attributes = True


class AvailableOrderResponse(BaseModel):
    id: str
    client_id: str
    title: Optional[str]
    description: Optional[str]
    budget: Optional[float]
    budget_max: Optional[float]
    address: Optional[str]
    deadline: Optional[datetime]
    scheduled_at: Optional[datetime]
    total_price: float
    status: OrderStatus
    created_at: datetime
    bids_count: int = 0

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _get_specialist_for_user(
    user_id: str, db: AsyncSession
) -> Specialist:
    """Return the Specialist linked to user_id or raise 403."""
    result = await db.execute(
        select(Specialist).where(Specialist.user_id == user_id)
    )
    specialist = result.scalar_one_or_none()
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом",
        )
    return specialist


async def _get_order_or_404(order_id: str, db: AsyncSession) -> Order:
    """Return an Order by id or raise 404."""
    result = await db.execute(
        select(Order).where(Order.id == order_id)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден",
        )
    return order


def _bid_to_response(bid: OrderBid, specialist: Specialist, user: Optional[User] = None) -> BidResponse:
    """Convert an OrderBid ORM object to a BidResponse."""
    specialist_info = None
    if specialist:
        specialist_info = SpecialistInfo(
            id=specialist.id,
            title=specialist.title,
            city=specialist.city,
            rating=specialist.rating,
            review_count=specialist.review_count,
            completed_orders=specialist.completed_orders,
            is_verified=specialist.is_verified,
            user_name=user.name if user else None,
            user_avatar=user.avatar if user else None,
        )

    return BidResponse(
        id=bid.id,
        order_id=bid.order_id,
        specialist_id=bid.specialist_id,
        price=bid.price,
        timeline=bid.timeline,
        message=bid.message,
        status=bid.status,
        created_at=bid.created_at,
        specialist=specialist_info,
    )


# ---------------------------------------------------------------------------
# POST /orders/{order_id}/bids  --  specialist submits a bid
# ---------------------------------------------------------------------------

@router.post("/orders/{order_id}/bids", response_model=BidResponse)
async def create_bid(
    order_id: str,
    data: BidCreateRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    specialist = await _get_specialist_for_user(user_id, db)
    order = await _get_order_or_404(order_id, db)

    # Only published orders accept bids
    if order.status != OrderStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Заказ не принимает отклики",
        )

    # Specialist must not be the order's client
    if order.client_id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Нельзя откликнуться на собственный заказ",
        )

    # Check for duplicate bid
    result = await db.execute(
        select(OrderBid).where(
            OrderBid.order_id == order_id,
            OrderBid.specialist_id == specialist.id,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Вы уже откликнулись на этот заказ",
        )

    bid = OrderBid(
        id=str(uuid4()),
        order_id=order_id,
        specialist_id=specialist.id,
        price=data.price,
        timeline=data.timeline,
        message=data.message,
        status=BidStatus.PENDING,
    )

    db.add(bid)
    await db.commit()
    await db.refresh(bid)

    # Fetch user for specialist info
    result = await db.execute(
        select(User).where(User.id == specialist.user_id)
    )
    user = result.scalar_one_or_none()

    return _bid_to_response(bid, specialist, user)


# ---------------------------------------------------------------------------
# GET /orders/{order_id}/bids  --  list bids for an order
# ---------------------------------------------------------------------------

@router.get("/orders/{order_id}/bids", response_model=List[BidResponse])
async def get_order_bids(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    order = await _get_order_or_404(order_id, db)

    # Check that requester is the order owner or a specialist who has bid
    is_owner = order.client_id == user_id

    if not is_owner:
        # Check if user is a specialist who already bid
        result = await db.execute(
            select(Specialist).where(Specialist.user_id == user_id)
        )
        specialist = result.scalar_one_or_none()

        if not specialist:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет доступа к откликам",
            )

        result = await db.execute(
            select(OrderBid).where(
                OrderBid.order_id == order_id,
                OrderBid.specialist_id == specialist.id,
            )
        )
        own_bid = result.scalar_one_or_none()
        if not own_bid:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Нет доступа к откликам",
            )

    # Fetch all bids for the order
    result = await db.execute(
        select(OrderBid)
        .where(OrderBid.order_id == order_id)
        .order_by(OrderBid.created_at.desc())
    )
    bids = result.scalars().all()

    # Collect specialist ids to fetch specialist + user info in bulk
    specialist_ids = [b.specialist_id for b in bids]
    specialists_map: dict = {}
    users_map: dict = {}

    if specialist_ids:
        result = await db.execute(
            select(Specialist).where(Specialist.id.in_(specialist_ids))
        )
        specialists = result.scalars().all()
        specialists_map = {s.id: s for s in specialists}

        user_ids = [s.user_id for s in specialists]
        result = await db.execute(
            select(User).where(User.id.in_(user_ids))
        )
        users = result.scalars().all()
        users_map = {u.id: u for u in users}

    responses: List[BidResponse] = []
    for bid in bids:
        spec = specialists_map.get(bid.specialist_id)
        usr = users_map.get(spec.user_id) if spec else None
        responses.append(_bid_to_response(bid, spec, usr))

    return responses


# ---------------------------------------------------------------------------
# POST /orders/{order_id}/bids/{bid_id}/accept  --  client accepts a bid
# ---------------------------------------------------------------------------

@router.post("/orders/{order_id}/bids/{bid_id}/accept")
async def accept_bid(
    order_id: str,
    bid_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    order = await _get_order_or_404(order_id, db)

    # Only the order owner can accept bids
    if order.client_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только заказчик может принять отклик",
        )

    if order.status != OrderStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Заказ не в статусе приёма откликов",
        )

    # Fetch the target bid
    result = await db.execute(
        select(OrderBid).where(
            OrderBid.id == bid_id,
            OrderBid.order_id == order_id,
        )
    )
    bid = result.scalar_one_or_none()

    if not bid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Отклик не найден",
        )

    if bid.status != BidStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Отклик уже обработан",
        )

    # Accept the target bid
    bid.status = BidStatus.ACCEPTED

    # Reject all other pending bids for this order
    result = await db.execute(
        select(OrderBid).where(
            OrderBid.order_id == order_id,
            OrderBid.id != bid_id,
            OrderBid.status == BidStatus.PENDING,
        )
    )
    other_bids = result.scalars().all()
    for other in other_bids:
        other.status = BidStatus.REJECTED

    # Assign specialist and update order status
    order.specialist_id = bid.specialist_id
    order.total_price = bid.price
    order.status = OrderStatus.ACCEPTED

    await db.commit()

    return {
        "success": True,
        "order_status": order.status.value,
        "bid_status": bid.status.value,
        "specialist_id": bid.specialist_id,
    }


# ---------------------------------------------------------------------------
# POST /orders/{order_id}/bids/{bid_id}/reject  --  client rejects a bid
# ---------------------------------------------------------------------------

@router.post("/orders/{order_id}/bids/{bid_id}/reject")
async def reject_bid(
    order_id: str,
    bid_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    order = await _get_order_or_404(order_id, db)

    if order.client_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Только заказчик может отклонить отклик",
        )

    result = await db.execute(
        select(OrderBid).where(
            OrderBid.id == bid_id,
            OrderBid.order_id == order_id,
        )
    )
    bid = result.scalar_one_or_none()

    if not bid:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Отклик не найден",
        )

    if bid.status != BidStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Отклик уже обработан",
        )

    bid.status = BidStatus.REJECTED
    await db.commit()

    return {"success": True, "bid_status": bid.status.value}


# ---------------------------------------------------------------------------
# GET /specialist/orders/available  --  specialist views available orders
# ---------------------------------------------------------------------------

@router.get("/specialist/orders/available", response_model=List[AvailableOrderResponse])
async def get_available_orders(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    specialist = await _get_specialist_for_user(user_id, db)

    # Get order ids where this specialist already placed a bid
    result = await db.execute(
        select(OrderBid.order_id).where(
            OrderBid.specialist_id == specialist.id
        )
    )
    already_bid_order_ids = [row[0] for row in result.all()]

    # Fetch published orders that the specialist has NOT bid on
    query = (
        select(Order)
        .where(Order.status == OrderStatus.PUBLISHED)
        .order_by(Order.created_at.desc())
    )

    if already_bid_order_ids:
        query = query.where(Order.id.notin_(already_bid_order_ids))

    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    orders = result.scalars().all()

    # Count bids per order
    order_ids = [o.id for o in orders]
    bids_count_map: dict = {}
    if order_ids:
        from sqlalchemy import func

        result = await db.execute(
            select(OrderBid.order_id, func.count(OrderBid.id))
            .where(OrderBid.order_id.in_(order_ids))
            .group_by(OrderBid.order_id)
        )
        bids_count_map = {row[0]: row[1] for row in result.all()}

    responses: List[AvailableOrderResponse] = []
    for order in orders:
        responses.append(
            AvailableOrderResponse(
                id=order.id,
                client_id=order.client_id,
                title=order.title,
                description=order.description,
                budget=order.budget,
                budget_max=order.budget_max,
                address=order.address,
                deadline=order.deadline,
                scheduled_at=order.scheduled_at,
                total_price=order.total_price,
                status=order.status,
                created_at=order.created_at,
                bids_count=bids_count_map.get(order.id, 0),
            )
        )

    return responses
