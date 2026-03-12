from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.order import OrderStatus, PaymentStatus


class OrderCreate(BaseModel):
    """Создание заказа — маркетплейс-флоу (без специалиста)"""
    title: str
    description: Optional[str] = None
    address: Optional[str] = None
    budget: Optional[float] = None
    budget_max: Optional[float] = None
    deadline: Optional[datetime] = None
    category_id: Optional[str] = None
    # Опционально: прямой заказ конкретному специалисту
    specialist_id: Optional[str] = None
    service_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None


class OrderResponse(BaseModel):
    id: str
    client_id: str
    specialist_id: Optional[str] = None
    service_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    budget: Optional[float] = None
    budget_max: Optional[float] = None
    deadline: Optional[datetime] = None
    scheduled_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    total_price: Optional[float] = None
    specialist_price: Optional[float] = None
    platform_fee: Optional[float] = None
    status: OrderStatus
    payment_status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True
