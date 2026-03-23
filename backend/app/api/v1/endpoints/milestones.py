from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from app.db.session import get_db
from app.models.milestone import Milestone, MilestoneStatus
from app.models.order import Order
from app.models.specialist import Specialist
from app.core.security import get_current_user_id

router = APIRouter()


# --- Schemas ---

class MilestoneCreate(BaseModel):
    title: str
    description: Optional[str] = None
    amount: float
    due_date: Optional[datetime] = None


class MilestoneResponse(BaseModel):
    id: str
    order_id: str
    title: str
    description: Optional[str] = None
    amount: float
    sequence: int
    status: str
    due_date: Optional[datetime] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- Endpoints ---

@router.post("/orders/{order_id}/milestones", response_model=List[MilestoneResponse])
async def create_milestones(
    order_id: str,
    items: List[MilestoneCreate],
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    # Verify order exists and user is owner or specialist
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    if order.client_id != user_id:
        # Check if user is the specialist
        spec_result = await db.execute(
            select(Specialist).where(Specialist.user_id == user_id)
        )
        specialist = spec_result.scalar_one_or_none()
        if not specialist or order.specialist_id != specialist.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    milestones = []
    for seq, item in enumerate(items, start=1):
        ms = Milestone(
            id=str(uuid4()),
            order_id=order_id,
            title=item.title,
            description=item.description,
            amount=item.amount,
            sequence=seq,
            due_date=item.due_date,
            status=MilestoneStatus.PENDING,
        )
        db.add(ms)
        milestones.append(ms)

    await db.commit()
    for ms in milestones:
        await db.refresh(ms)

    return [MilestoneResponse.model_validate(ms) for ms in milestones]


@router.get("/orders/{order_id}/milestones", response_model=List[MilestoneResponse])
async def get_milestones(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Milestone)
        .where(Milestone.order_id == order_id)
        .order_by(Milestone.sequence)
    )
    milestones = result.scalars().all()
    return [MilestoneResponse.model_validate(ms) for ms in milestones]


@router.post("/milestones/{milestone_id}/fund")
async def fund_milestone(
    milestone_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Milestone).where(Milestone.id == milestone_id))
    ms = result.scalar_one_or_none()
    if not ms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Этап не найден")

    if ms.status != MilestoneStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Этап уже профинансирован")

    # Verify client owns the order
    result = await db.execute(select(Order).where(Order.id == ms.order_id))
    order = result.scalar_one_or_none()
    if not order or order.client_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    ms.status = MilestoneStatus.FUNDED
    await db.commit()

    return {"success": True, "status": ms.status.value}


@router.post("/milestones/{milestone_id}/submit")
async def submit_milestone(
    milestone_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Milestone).where(Milestone.id == milestone_id))
    ms = result.scalar_one_or_none()
    if not ms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Этап не найден")

    if ms.status not in (MilestoneStatus.FUNDED, MilestoneStatus.IN_PROGRESS):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Невозможно отправить на проверку")

    # Verify specialist
    spec_result = await db.execute(select(Specialist).where(Specialist.user_id == user_id))
    specialist = spec_result.scalar_one_or_none()
    if not specialist:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Вы не являетесь специалистом")

    result = await db.execute(select(Order).where(Order.id == ms.order_id))
    order = result.scalar_one_or_none()
    if not order or order.specialist_id != specialist.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    ms.status = MilestoneStatus.SUBMITTED
    ms.submitted_at = datetime.utcnow()
    await db.commit()

    return {"success": True, "status": ms.status.value}


@router.post("/milestones/{milestone_id}/approve")
async def approve_milestone(
    milestone_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Milestone).where(Milestone.id == milestone_id))
    ms = result.scalar_one_or_none()
    if not ms:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Этап не найден")

    if ms.status != MilestoneStatus.SUBMITTED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Этап не отправлен на проверку")

    # Verify client owns the order
    result = await db.execute(select(Order).where(Order.id == ms.order_id))
    order = result.scalar_one_or_none()
    if not order or order.client_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    ms.status = MilestoneStatus.APPROVED
    ms.approved_at = datetime.utcnow()
    await db.commit()

    return {"success": True, "status": ms.status.value}
