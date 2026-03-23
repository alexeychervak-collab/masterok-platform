from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from app.db.session import get_db
from app.models.dispute import Dispute, DisputeStatus, DisputeEvidence
from app.models.order import Order, OrderStatus
from app.models.user import User, UserRole
from app.core.security import get_current_user_id

router = APIRouter()


# --- Schemas ---

class DisputeCreate(BaseModel):
    reason: str


class EvidenceCreate(BaseModel):
    description: str


class DisputeResolve(BaseModel):
    decision: str  # resolved_client, resolved_specialist, resolved_split
    resolution_note: Optional[str] = None


class EvidenceResponse(BaseModel):
    id: str
    dispute_id: str
    submitted_by: str
    description: str
    created_at: datetime

    class Config:
        from_attributes = True


class DisputeResponse(BaseModel):
    id: str
    order_id: str
    opened_by: str
    reason: str
    status: str
    resolution_note: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime
    evidence: List[EvidenceResponse] = []

    class Config:
        from_attributes = True


async def _require_admin(user_id: str, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Требуются права администратора")
    return user


# --- Endpoints ---

@router.post("/orders/{order_id}/dispute", response_model=DisputeResponse)
async def open_dispute(
    order_id: str,
    data: DisputeCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    # Check existing dispute
    result = await db.execute(select(Dispute).where(Dispute.order_id == order_id))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Спор по этому заказу уже открыт")

    dispute = Dispute(
        id=str(uuid4()),
        order_id=order_id,
        opened_by=user_id,
        reason=data.reason,
        status=DisputeStatus.OPEN,
    )

    db.add(dispute)

    # Update order status
    order.status = OrderStatus.DISPUTED

    await db.commit()
    await db.refresh(dispute)

    return DisputeResponse(
        id=dispute.id,
        order_id=dispute.order_id,
        opened_by=dispute.opened_by,
        reason=dispute.reason,
        status=dispute.status.value,
        resolution_note=dispute.resolution_note,
        resolved_by=dispute.resolved_by,
        resolved_at=dispute.resolved_at,
        created_at=dispute.created_at,
        evidence=[],
    )


@router.post("/disputes/{dispute_id}/evidence", response_model=EvidenceResponse)
async def add_evidence(
    dispute_id: str,
    data: EvidenceCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Dispute).where(Dispute.id == dispute_id))
    dispute = result.scalar_one_or_none()
    if not dispute:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Спор не найден")

    if dispute.status not in (DisputeStatus.OPEN, DisputeStatus.UNDER_REVIEW):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Спор уже закрыт")

    evidence = DisputeEvidence(
        id=str(uuid4()),
        dispute_id=dispute_id,
        submitted_by=user_id,
        description=data.description,
    )

    db.add(evidence)
    await db.commit()
    await db.refresh(evidence)

    return EvidenceResponse.model_validate(evidence)


@router.get("/disputes/{dispute_id}", response_model=DisputeResponse)
async def get_dispute(
    dispute_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Dispute).where(Dispute.id == dispute_id))
    dispute = result.scalar_one_or_none()
    if not dispute:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Спор не найден")

    # Load evidence
    result = await db.execute(
        select(DisputeEvidence)
        .where(DisputeEvidence.dispute_id == dispute_id)
        .order_by(DisputeEvidence.created_at.asc())
    )
    evidence_list = result.scalars().all()

    return DisputeResponse(
        id=dispute.id,
        order_id=dispute.order_id,
        opened_by=dispute.opened_by,
        reason=dispute.reason,
        status=dispute.status.value,
        resolution_note=dispute.resolution_note,
        resolved_by=dispute.resolved_by,
        resolved_at=dispute.resolved_at,
        created_at=dispute.created_at,
        evidence=[EvidenceResponse.model_validate(e) for e in evidence_list],
    )


@router.post("/admin/disputes/{dispute_id}/resolve")
async def resolve_dispute(
    dispute_id: str,
    data: DisputeResolve,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _require_admin(user_id, db)

    result = await db.execute(select(Dispute).where(Dispute.id == dispute_id))
    dispute = result.scalar_one_or_none()
    if not dispute:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Спор не найден")

    valid_decisions = {"resolved_client", "resolved_specialist", "resolved_split"}
    if data.decision not in valid_decisions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Решение должно быть одним из: {', '.join(valid_decisions)}",
        )

    dispute.status = DisputeStatus(data.decision)
    dispute.resolution_note = data.resolution_note
    dispute.resolved_by = user_id
    dispute.resolved_at = datetime.utcnow()

    await db.commit()

    return {"success": True, "status": dispute.status.value}
