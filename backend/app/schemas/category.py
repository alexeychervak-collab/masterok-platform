from pydantic import BaseModel
from typing import Optional, List


class SkillResponse(BaseModel):
    id: str
    name: str
    slug: str
    category_id: str

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str]
    icon: Optional[str]
    image: Optional[str]
    order: int
    skills: List[SkillResponse] = []

    class Config:
        from_attributes = True




