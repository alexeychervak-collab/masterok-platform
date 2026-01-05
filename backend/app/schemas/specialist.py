from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SkillInfo(BaseModel):
    id: str
    name: str
    level: str
    years_exp: int

    class Config:
        from_attributes = True


class SpecialistCreate(BaseModel):
    title: str
    description: str
    city: str
    experience: int = 0
    education: Optional[str] = None
    skills: List[str] = []  # skill IDs


class SpecialistResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    city: str
    experience: int
    rating: float
    review_count: int
    completed_orders: int
    response_time: int
    is_verified: bool
    is_premium: bool
    is_available: bool
    education: Optional[str]
    created_at: datetime
    
    # Nested
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None
    skills: List[SkillInfo] = []

    class Config:
        from_attributes = True


class SpecialistListResponse(BaseModel):
    items: List[SpecialistResponse]
    total: int
    page: int
    per_page: int
    pages: int




