from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from app.db.session import get_db
from app.models.verification import VerificationRequest, VerificationStatus
from app.models.specialist import Specialist
from app.models.user import User, UserRole
from app.core.security import get_current_user_id

router = APIRouter()


# --- Schemas ---

class VerificationSubmit(BaseModel):
    document_type: str  # passport, diploma, license, insurance


class VerificationResponse(BaseModel):
    id: str
    specialist_id: str
    document_type: str
    status: str
    rejection_reason: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class VerificationReject(BaseModel):
    reason: str


# --- Helpers ---

async def require_admin(user_id: str, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Требуются права администратора")
    return user


# --- Specialist endpoints ---

@router.post("/verification/submit", response_model=VerificationResponse)
async def submit_verification(
    data: VerificationSubmit,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Specialist).where(Specialist.user_id == user_id))
    specialist = result.scalar_one_or_none()
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом",
        )

    # Check if a pending request already exists
    result = await db.execute(
        select(VerificationRequest).where(
            VerificationRequest.specialist_id == specialist.id,
            VerificationRequest.document_type == data.document_type,
            VerificationRequest.status.in_([VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW]),
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Заявка на верификацию уже подана",
        )

    req = VerificationRequest(
        id=str(uuid4()),
        specialist_id=specialist.id,
        document_type=data.document_type,
        status=VerificationStatus.PENDING,
    )

    db.add(req)
    await db.commit()
    await db.refresh(req)

    return VerificationResponse.model_validate(req)


@router.get("/verification/my", response_model=List[VerificationResponse])
async def get_my_verification(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Specialist).where(Specialist.user_id == user_id))
    specialist = result.scalar_one_or_none()
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом",
        )

    result = await db.execute(
        select(VerificationRequest)
        .where(VerificationRequest.specialist_id == specialist.id)
        .order_by(VerificationRequest.created_at.desc())
    )
    requests = result.scalars().all()
    return [VerificationResponse.model_validate(r) for r in requests]


# --- Admin endpoints ---

@router.get("/admin/verification/pending", response_model=List[VerificationResponse])
async def get_pending_verifications(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(user_id, db)

    result = await db.execute(
        select(VerificationRequest)
        .where(VerificationRequest.status.in_([VerificationStatus.PENDING, VerificationStatus.UNDER_REVIEW]))
        .order_by(VerificationRequest.created_at.asc())
    )
    requests = result.scalars().all()
    return [VerificationResponse.model_validate(r) for r in requests]


@router.post("/admin/verification/{request_id}/approve")
async def approve_verification(
    request_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(user_id, db)

    result = await db.execute(select(VerificationRequest).where(VerificationRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена")

    req.status = VerificationStatus.APPROVED
    req.reviewer_id = user_id
    req.reviewed_at = datetime.utcnow()

    # Mark specialist as verified
    result = await db.execute(select(Specialist).where(Specialist.id == req.specialist_id))
    specialist = result.scalar_one_or_none()
    if specialist:
        specialist.is_verified = True

    await db.commit()

    return {"success": True, "status": req.status.value}


@router.post("/admin/verification/{request_id}/reject")
async def reject_verification(
    request_id: str,
    data: VerificationReject,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await require_admin(user_id, db)

    result = await db.execute(select(VerificationRequest).where(VerificationRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена")

    req.status = VerificationStatus.REJECTED
    req.reviewer_id = user_id
    req.reviewed_at = datetime.utcnow()
    req.rejection_reason = data.reason

    await db.commit()

    return {"success": True, "status": req.status.value}
