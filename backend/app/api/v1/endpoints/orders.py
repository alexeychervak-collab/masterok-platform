from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
import uuid

from app.db.session import get_db
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.service import Service
from app.models.specialist import Specialist
from app.schemas.order import OrderCreate, OrderResponse
from app.core.security import get_current_user_id
from app.core.config import settings

router = APIRouter()


@router.get("", response_model=List[OrderResponse])
async def get_orders(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    status: Optional[OrderStatus] = None,
):
    # Get as client
    query = select(Order).where(Order.client_id == user_id)
    
    if status:
        query = query.where(Order.status == status)
    
    query = query.order_by(Order.created_at.desc())
    
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return [OrderResponse.model_validate(o) for o in orders]


@router.get("/specialist", response_model=List[OrderResponse])
async def get_specialist_orders(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    status: Optional[OrderStatus] = None,
):
    # Get specialist
    result = await db.execute(
        select(Specialist).where(Specialist.user_id == user_id)
    )
    specialist = result.scalar_one_or_none()
    
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом"
        )
    
    query = select(Order).where(Order.specialist_id == specialist.id)
    
    if status:
        query = query.where(Order.status == status)
    
    query = query.order_by(Order.created_at.desc())
    
    result = await db.execute(query)
    orders = result.scalars().all()
    
    return [OrderResponse.model_validate(o) for o in orders]


@router.post("", response_model=OrderResponse)
async def create_order(
    data: OrderCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Get service
    result = await db.execute(select(Service).where(Service.id == data.service_id))
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Услуга не найдена"
        )
    
    # Calculate prices
    total_price = service.price
    platform_fee = total_price * (settings.PLATFORM_FEE_PERCENT / 100)
    specialist_price = total_price - platform_fee
    
    order = Order(
        id=str(uuid.uuid4()),
        client_id=user_id,
        specialist_id=data.specialist_id,
        service_id=data.service_id,
        description=data.description,
        address=data.address,
        scheduled_at=data.scheduled_at,
        total_price=total_price,
        specialist_price=specialist_price,
        platform_fee=platform_fee,
    )
    
    db.add(order)
    await db.commit()
    await db.refresh(order)
    
    return OrderResponse.model_validate(order)


@router.post("/{order_id}/accept")
async def accept_order(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Get specialist
    result = await db.execute(
        select(Specialist).where(Specialist.user_id == user_id)
    )
    specialist = result.scalar_one_or_none()
    
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом"
        )
    
    # Get order
    result = await db.execute(
        select(Order).where(
            Order.id == order_id,
            Order.specialist_id == specialist.id
        )
    )
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден"
        )
    
    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Заказ уже обработан"
        )
    
    order.status = OrderStatus.ACCEPTED
    await db.commit()
    
    return {"success": True, "status": order.status.value}


@router.post("/{order_id}/complete")
async def complete_order(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Get order
    result = await db.execute(
        select(Order).where(
            Order.id == order_id,
            Order.client_id == user_id
        )
    )
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден"
        )
    
    if order.status not in [OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Невозможно завершить заказ в текущем статусе"
        )
    
    order.status = OrderStatus.COMPLETED
    order.payment_status = PaymentStatus.RELEASED
    
    # Update specialist stats
    result = await db.execute(
        select(Specialist).where(Specialist.id == order.specialist_id)
    )
    specialist = result.scalar_one_or_none()
    if specialist:
        specialist.completed_orders += 1
    
    await db.commit()
    
    return {"success": True, "status": order.status.value}


@router.post("/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Get order
    result = await db.execute(
        select(Order).where(
            Order.id == order_id,
            Order.client_id == user_id
        )
    )
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден"
        )
    
    if order.status not in [OrderStatus.PENDING, OrderStatus.ACCEPTED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Невозможно отменить заказ в текущем статусе"
        )
    
    order.status = OrderStatus.CANCELLED
    order.payment_status = PaymentStatus.REFUNDED
    await db.commit()
    
    return {"success": True, "status": order.status.value}




