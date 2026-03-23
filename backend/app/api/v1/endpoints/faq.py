from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4

from app.db.session import get_db
from app.models.faq import FaqItem
from app.models.user import User, UserRole
from app.core.security import get_current_user_id

router = APIRouter()


# --- Schemas ---

class FaqCreate(BaseModel):
    question: str
    answer: str
    category: Optional[str] = None
    sort_order: int = 0
    is_published: bool = True


class FaqResponse(BaseModel):
    id: str
    question: str
    answer: str
    category: Optional[str] = None
    sort_order: int
    is_published: bool

    class Config:
        from_attributes = True


async def _require_admin(user_id: str, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Требуются права администратора")
    return user


# --- Endpoints ---

@router.get("", response_model=List[FaqResponse])
async def list_faq(
    db: AsyncSession = Depends(get_db),
    category: Optional[str] = Query(None),
):
    query = select(FaqItem).where(FaqItem.is_published == True)
    if category:
        query = query.where(FaqItem.category == category)
    query = query.order_by(FaqItem.sort_order.asc())

    result = await db.execute(query)
    items = result.scalars().all()
    return [FaqResponse.model_validate(item) for item in items]


@router.post("", response_model=FaqResponse)
async def create_faq(
    data: FaqCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _require_admin(user_id, db)

    item = FaqItem(
        id=str(uuid4()),
        question=data.question,
        answer=data.answer,
        category=data.category,
        sort_order=data.sort_order,
        is_published=data.is_published,
    )

    db.add(item)
    await db.commit()
    await db.refresh(item)

    return FaqResponse.model_validate(item)
