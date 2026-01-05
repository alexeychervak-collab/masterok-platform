from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ServiceCreate(BaseModel):
    category_id: str
    name: str
    description: Optional[str] = None
    price: float
    price_unit: str = "за услугу"
    duration: Optional[int] = None


class ServiceResponse(BaseModel):
    id: str
    specialist_id: str
    category_id: str
    name: str
    description: Optional[str]
    price: float
    price_unit: str
    duration: Optional[int]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True




