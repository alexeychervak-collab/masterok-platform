from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    order_id: str
    rating: int = Field(..., ge=1, le=5)
    comment: str
    pros: Optional[str] = None
    cons: Optional[str] = None


class ReviewResponse(BaseModel):
    id: str
    order_id: str
    user_id: str
    specialist_id: str
    rating: int
    comment: str
    pros: Optional[str]
    cons: Optional[str]
    response: Optional[str]
    is_published: bool
    created_at: datetime
    
    # Nested
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None

    class Config:
        from_attributes = True




