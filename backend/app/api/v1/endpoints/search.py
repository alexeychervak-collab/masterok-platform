from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.db.session import get_db
from app.models.specialist import Specialist
from app.models.user import User
from app.models.order import Order, OrderStatus
from app.core.security import get_current_user_id

router = APIRouter()


@router.get("")
async def search(
    q: str = Query(..., min_length=1),
    type: Optional[str] = Query(None, regex="^(specialists|orders)$"),
    category: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    verified: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    results = {"specialists": [], "orders": []}
    pattern = f"%{q}%"
    offset = (page - 1) * per_page

    # Search specialists
    if type is None or type == "specialists":
        stmt = (
            select(Specialist)
            .join(User, Specialist.user_id == User.id)
            .where(
                or_(
                    Specialist.title.ilike(pattern),
                    Specialist.description.ilike(pattern),
                    User.name.ilike(pattern),
                )
            )
        )

        if city:
            stmt = stmt.where(Specialist.city.ilike(f"%{city}%"))
        if min_rating is not None:
            stmt = stmt.where(Specialist.rating >= min_rating)
        if verified is not None:
            stmt = stmt.where(Specialist.is_verified == verified)

        stmt = stmt.order_by(Specialist.rating.desc())
        stmt = stmt.offset(offset).limit(per_page)

        result = await db.execute(stmt)
        specialists = result.scalars().all()
        results["specialists"] = [
            {
                "id": s.id,
                "title": s.title,
                "city": s.city,
                "rating": s.rating,
                "experience": s.experience,
                "is_verified": s.is_verified,
                "review_count": s.review_count,
            }
            for s in specialists
        ]

    # Search orders
    if type is None or type == "orders":
        stmt = select(Order).where(
            Order.status == OrderStatus.PUBLISHED,
            or_(
                Order.title.ilike(pattern),
                Order.description.ilike(pattern),
            ),
        )

        if city:
            stmt = stmt.where(Order.address.ilike(f"%{city}%"))

        stmt = stmt.order_by(Order.created_at.desc())
        stmt = stmt.offset(offset).limit(per_page)

        result = await db.execute(stmt)
        orders = result.scalars().all()
        results["orders"] = [
            {
                "id": o.id,
                "title": o.title,
                "description": o.description,
                "budget": o.budget,
                "address": o.address,
                "status": o.status.value if o.status else None,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in orders
        ]

    return results
