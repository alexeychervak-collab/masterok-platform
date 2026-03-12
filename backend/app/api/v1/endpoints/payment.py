"""
Payment API endpoints
Secure payments via YooKassa with escrow (hold/capture)
"""

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional, Literal
import logging

from app.db.session import get_db
from app.core.security import get_current_user_id
from app.models.user import User
from app.models.order import Order
from app.models.payment import Payment
from app.services.yookassa_service import (
    create_payment_by_token,
    get_payment,
    capture_payment,
    refund_payment,
    YooKassaError,
)

router = APIRouter()
log = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class CreatePaymentRequest(BaseModel):
    """Request to create a payment"""
    order_id: str
    payment_token: str
    payment_method: Literal["bank_card", "yoo_money", "sbp"] = "bank_card"
    return_url: Optional[str] = None


class CapturePaymentRequest(BaseModel):
    """Request to capture a held payment"""
    payment_id: str
    order_id: str


class RefundPaymentRequest(BaseModel):
    """Request to refund a payment"""
    payment_id: str
    order_id: str
    reason: str


class PaymentResponse(BaseModel):
    """Payment data response"""
    payment_id: str
    status: str
    amount: str
    confirmation_url: Optional[str] = None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/create", response_model=PaymentResponse)
async def create_payment(
    request: CreatePaymentRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a payment with hold (escrow).

    Flow:
    1. Client creates an order
    2. Client pays (funds are held)
    3. Specialist completes the work
    4. Client confirms -> capture -> funds go to specialist
    """
    # Fetch the current user
    result = await db.execute(select(User).where(User.id == user_id))
    current_user = result.scalar_one_or_none()
    if not current_user:
        raise HTTPException(status_code=401, detail="User not found")

    # Verify the order exists and belongs to this user
    result = await db.execute(select(Order).where(Order.id == request.order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="This is not your order")

    if order.status != "pending":
        raise HTTPException(status_code=400, detail="Order is already paid or completed")

    try:
        # Create a payment in YooKassa with hold (capture=False)
        payment_data = await create_payment_by_token(
            amount=str(order.budget),
            description=f"Order #{order.id}: {order.title}",
            payment_token=request.payment_token,
            metadata={
                "order_id": order.id,
                "client_id": current_user.id,
                "specialist_id": order.specialist_id,
            },
            capture=False,
            customer_email=current_user.email,
            customer_phone=current_user.phone,
            return_url=request.return_url or "masterok://payment/success",
        )

        # Persist the payment record
        payment = Payment(
            id=str(uuid4()),
            order_id=order.id,
            yookassa_payment_id=payment_data["id"],
            amount=order.budget,
            status=payment_data["status"],
            payment_method=request.payment_method,
        )
        db.add(payment)

        # Update order status
        order.status = "payment_pending"
        await db.commit()

        log.info(f"Payment created: {payment_data['id']} for order {order.id}")

        return PaymentResponse(
            payment_id=payment_data["id"],
            status=payment_data["status"],
            amount=str(order.budget),
            confirmation_url=payment_data.get("confirmation", {}).get("confirmation_url"),
        )

    except YooKassaError as e:
        await db.rollback()
        log.error(f"YooKassa error: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        await db.rollback()
        log.error(f"Payment creation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Payment creation error")


@router.post("/capture", response_model=PaymentResponse)
async def capture_payment_endpoint(
    request: CapturePaymentRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Capture a held payment after work is completed.

    Called by the client after confirming the work is done.
    Funds are transferred to the specialist.
    """
    # Fetch the current user
    result = await db.execute(select(User).where(User.id == user_id))
    current_user = result.scalar_one_or_none()
    if not current_user:
        raise HTTPException(status_code=401, detail="User not found")

    # Verify the order
    result = await db.execute(select(Order).where(Order.id == request.order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the client can confirm completion")

    # Verify the payment
    result = await db.execute(
        select(Payment).where(
            Payment.order_id == order.id,
            Payment.yookassa_payment_id == request.payment_id,
        )
    )
    payment = result.scalar_one_or_none()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status == "succeeded":
        raise HTTPException(status_code=400, detail="Payment already completed")

    try:
        # Capture in YooKassa
        captured_data = await capture_payment(request.payment_id)

        # Update statuses
        payment.status = captured_data["status"]
        order.status = "paid"
        await db.commit()

        log.info(f"Payment captured: {request.payment_id} for order {order.id}")

        # TODO: Send notification to the specialist about the payment

        return PaymentResponse(
            payment_id=captured_data["id"],
            status=captured_data["status"],
            amount=captured_data["amount"]["value"],
        )

    except YooKassaError as e:
        await db.rollback()
        log.error(f"YooKassa capture error: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        await db.rollback()
        log.error(f"Payment capture error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Payment capture error")


@router.post("/refund", response_model=PaymentResponse)
async def refund_payment_endpoint(
    request: RefundPaymentRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """
    Refund a payment on dispute or cancellation.

    Can be called by:
    - The client (if the specialist did not complete the work)
    - An admin (when resolving a dispute)
    """
    # Fetch the current user
    result = await db.execute(select(User).where(User.id == user_id))
    current_user = result.scalar_one_or_none()
    if not current_user:
        raise HTTPException(status_code=401, detail="User not found")

    # Verify the order
    result = await db.execute(select(Order).where(Order.id == request.order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Check permissions: must be the client or an admin
    is_client = order.client_id == current_user.id
    is_admin = current_user.role == "admin"

    if not (is_client or is_admin):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    # Verify the payment
    result = await db.execute(
        select(Payment).where(
            Payment.order_id == order.id,
            Payment.yookassa_payment_id == request.payment_id,
        )
    )
    payment = result.scalar_one_or_none()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    if payment.status == "refunded":
        raise HTTPException(status_code=400, detail="Payment already refunded")

    try:
        # Refund via YooKassa
        refund_data = await refund_payment(
            payment_id=request.payment_id,
            amount={"value": str(payment.amount), "currency": "RUB"},
            reason=request.reason,
        )

        # Update statuses
        payment.status = "refunded"
        order.status = "cancelled"
        await db.commit()

        log.info(f"Payment refunded: {request.payment_id} for order {order.id}")

        # TODO: Send notifications to the client and specialist

        return PaymentResponse(
            payment_id=refund_data["payment_id"],
            status="refunded",
            amount=refund_data["amount"]["value"],
        )

    except YooKassaError as e:
        await db.rollback()
        log.error(f"YooKassa refund error: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        await db.rollback()
        log.error(f"Payment refund error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Payment refund error")


@router.get("/{payment_id}")
async def get_payment_status(
    payment_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get payment status"""
    # Fetch the current user
    result = await db.execute(select(User).where(User.id == user_id))
    current_user = result.scalar_one_or_none()
    if not current_user:
        raise HTTPException(status_code=401, detail="User not found")

    # Look up the payment
    result = await db.execute(
        select(Payment).where(Payment.yookassa_payment_id == payment_id)
    )
    payment = result.scalar_one_or_none()

    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Look up the associated order for permission checks
    result = await db.execute(select(Order).where(Order.id == payment.order_id))
    order = result.scalar_one_or_none()

    is_client = order and order.client_id == current_user.id
    is_specialist = order and order.specialist_id == current_user.id
    is_admin = current_user.role == "admin"

    if not (is_client or is_specialist or is_admin):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    try:
        # Fetch the current status from YooKassa
        payment_data = await get_payment(payment_id)

        # Sync status back to DB
        payment.status = payment_data["status"]
        await db.commit()

        return {
            "payment_id": payment_data["id"],
            "status": payment_data["status"],
            "amount": payment_data["amount"]["value"],
            "created_at": payment_data["created_at"],
            "captured_at": payment_data.get("captured_at"),
            "refunded_amount": payment_data.get("refunded_amount"),
        }

    except YooKassaError as e:
        await db.rollback()
        log.error(f"YooKassa get payment error: {e.message}")
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        await db.rollback()
        log.error(f"Get payment error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error fetching payment")


@router.post("/webhook")
async def yookassa_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Webhook for processing YooKassa events.

    Events:
    - payment.succeeded  -- payment succeeded
    - payment.canceled   -- payment canceled
    - refund.succeeded   -- refund completed
    """
    try:
        data = await request.json()
        event_type = data.get("event")
        payment_obj = data.get("object", {})
        payment_id = payment_obj.get("id")

        log.info(f"YooKassa webhook: {event_type} for payment {payment_id}")

        # Find the payment in the DB
        result = await db.execute(
            select(Payment).where(Payment.yookassa_payment_id == payment_id)
        )
        payment = result.scalar_one_or_none()

        if not payment:
            log.warning(f"Payment {payment_id} not found in database")
            return {"status": "ok"}

        # Load the associated order
        result = await db.execute(select(Order).where(Order.id == payment.order_id))
        order = result.scalar_one_or_none()

        # Update statuses based on event type
        if event_type == "payment.succeeded":
            payment.status = "succeeded"
            if order:
                order.status = "paid"

        elif event_type == "payment.canceled":
            payment.status = "canceled"
            if order:
                order.status = "cancelled"

        elif event_type == "refund.succeeded":
            payment.status = "refunded"
            if order:
                order.status = "cancelled"

        await db.commit()

        # TODO: Send push notification to the user

        return {"status": "ok"}

    except Exception as e:
        await db.rollback()
        log.error(f"Webhook processing error: {str(e)}", exc_info=True)
        return {"status": "error", "message": str(e)}
