from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.order import OrderStatus, PaymentStatus


class OrderCreate(BaseModel):
    specialist_id: str
    service_id: str
    description: Optional[str] = None
    address: Optional[str] = None
    scheduled_at: Optional[datetime] = None


class OrderResponse(BaseModel):
    id: str
    client_id: str
    specialist_id: str
    service_id: str
    description: Optional[str]
    address: Optional[str]
    scheduled_at: Optional[datetime]
    completed_at: Optional[datetime]
    total_price: float
    specialist_price: float
    platform_fee: float
    status: OrderStatus
    payment_status: PaymentStatus
    created_at: datetime

    class Config:
        from_attributes = True




