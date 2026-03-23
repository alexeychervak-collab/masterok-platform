from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from app.db.session import get_db
from app.models.progress_update import ProgressUpdate
from app.models.order import Order
from app.models.specialist import Specialist
from app.core.security import get_current_user_id

router = APIRouter()


class ProgressCreate(BaseModel):
    description: str
    progress_percent: int = 0
    milestone_id: Optional[str] = None


class ProgressResponse(BaseModel):
    id: str
    order_id: str
    specialist_id: str
    milestone_id: Optional[str] = None
    description: str
    progress_percent: int
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/orders/{order_id}/progress", response_model=ProgressResponse)
async def create_progress_update(
    order_id: str,
    data: ProgressCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    # Verify specialist
    result = await db.execute(select(Specialist).where(Specialist.user_id == user_id))
    specialist = result.scalar_one_or_none()
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом",
        )

    # Verify order
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order or order.specialist_id != specialist.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    update = ProgressUpdate(
        id=str(uuid4()),
        order_id=order_id,
        specialist_id=specialist.id,
        milestone_id=data.milestone_id,
        description=data.description,
        progress_percent=data.progress_percent,
    )

    db.add(update)
    await db.commit()
    await db.refresh(update)

    return ProgressResponse.model_validate(update)


@router.get("/orders/{order_id}/progress", response_model=List[ProgressResponse])
async def get_progress_updates(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ProgressUpdate)
        .where(ProgressUpdate.order_id == order_id)
        .order_by(ProgressUpdate.created_at.desc())
    )
    updates = result.scalars().all()
    return [ProgressResponse.model_validate(u) for u in updates]
