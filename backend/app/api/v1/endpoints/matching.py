from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.db.session import get_db
from app.models.order import Order
from app.core.security import get_current_user_id
from app.services.matching_service import find_matches, recommend_by_params

router = APIRouter()


@router.get("/orders/{order_id}/recommended-specialists")
async def get_recommended_for_order(
    order_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заказ не найден")

    scored = await find_matches(db, order, limit=10)

    return [
        {
            "specialist_id": s.specialist.id,
            "name": s.specialist.title,
            "city": s.specialist.city,
            "rating": s.specialist.rating,
            "experience": s.specialist.experience,
            "score": s.score,
            "breakdown": s.breakdown,
        }
        for s in scored
    ]


@router.get("/specialists/recommended")
async def get_recommended_specialists(
    category_id: Optional[str] = Query(None),
    budget: Optional[float] = Query(None),
    city: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    scored = await recommend_by_params(
        db,
        category_id=category_id,
        budget=budget,
        city=city,
        limit=10,
    )

    return [
        {
            "specialist_id": s.specialist.id,
            "name": s.specialist.title,
            "city": s.specialist.city,
            "rating": s.specialist.rating,
            "experience": s.specialist.experience,
            "score": s.score,
            "breakdown": s.breakdown,
        }
        for s in scored
    ]
