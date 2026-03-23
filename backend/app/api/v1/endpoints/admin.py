from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.order import Order, OrderStatus
from app.models.dispute import Dispute
from app.models.payment import Payment
from app.core.security import get_current_user_id

router = APIRouter()


# --- Schemas ---

class UserAdminResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserAdminUpdate(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[str] = None


class DashboardResponse(BaseModel):
    total_users: int
    total_orders: int
    total_revenue: float
    open_disputes: int


class TimeSeriesPoint(BaseModel):
    date: str
    count: int


class AnalyticsResponse(BaseModel):
    registrations_per_day: List[TimeSeriesPoint]
    orders_per_day: List[TimeSeriesPoint]


class OrderAdminResponse(BaseModel):
    id: str
    title: Optional[str] = None
    client_id: str
    specialist_id: Optional[str] = None
    status: str
    total_price: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Admin dependency ---

async def require_admin(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> str:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Требуются права администратора",
        )
    return user_id


# --- Endpoints ---

@router.get("/admin/dashboard", response_model=DashboardResponse)
async def admin_dashboard(
    user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    users_count = (await db.execute(select(func.count(User.id)))).scalar() or 0
    orders_count = (await db.execute(select(func.count(Order.id)))).scalar() or 0

    revenue_result = await db.execute(
        select(func.coalesce(func.sum(Order.platform_fee), 0.0))
        .where(Order.status == OrderStatus.COMPLETED)
    )
    total_revenue = float(revenue_result.scalar() or 0.0)

    disputes_count = (await db.execute(
        select(func.count(Dispute.id)).where(Dispute.status == "open")
    )).scalar() or 0

    return DashboardResponse(
        total_users=users_count,
        total_orders=orders_count,
        total_revenue=total_revenue,
        open_disputes=disputes_count,
    )


@router.get("/admin/users", response_model=List[UserAdminResponse])
async def admin_users(
    user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: Optional[str] = Query(None),
):
    query = select(User)
    if role:
        query = query.where(User.role == role)
    query = query.order_by(User.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(query)
    users = result.scalars().all()
    return [UserAdminResponse.model_validate(u) for u in users]


@router.patch("/admin/users/{target_user_id}", response_model=UserAdminResponse)
async def admin_update_user(
    target_user_id: str,
    data: UserAdminUpdate,
    user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == target_user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")

    if data.is_active is not None:
        user.is_active = data.is_active
    if data.role is not None:
        user.role = UserRole(data.role)

    await db.commit()
    await db.refresh(user)

    return UserAdminResponse.model_validate(user)


@router.get("/admin/orders", response_model=List[OrderAdminResponse])
async def admin_orders(
    user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    order_status: Optional[str] = Query(None, alias="status"),
):
    query = select(Order)
    if order_status:
        query = query.where(Order.status == order_status)
    query = query.order_by(Order.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(query)
    orders = result.scalars().all()
    return [OrderAdminResponse.model_validate(o) for o in orders]


@router.get("/admin/analytics", response_model=AnalyticsResponse)
async def admin_analytics(
    user_id: str = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365),
):
    since = datetime.utcnow() - timedelta(days=days)

    # Registrations per day
    reg_result = await db.execute(
        select(
            cast(User.created_at, Date).label("date"),
            func.count(User.id).label("count"),
        )
        .where(User.created_at >= since)
        .group_by(cast(User.created_at, Date))
        .order_by(cast(User.created_at, Date))
    )
    registrations = [
        TimeSeriesPoint(date=str(row.date), count=row.count)
        for row in reg_result.all()
    ]

    # Orders per day
    ord_result = await db.execute(
        select(
            cast(Order.created_at, Date).label("date"),
            func.count(Order.id).label("count"),
        )
        .where(Order.created_at >= since)
        .group_by(cast(Order.created_at, Date))
        .order_by(cast(Order.created_at, Date))
    )
    orders_per_day = [
        TimeSeriesPoint(date=str(row.date), count=row.count)
        for row in ord_result.all()
    ]

    return AnalyticsResponse(
        registrations_per_day=registrations,
        orders_per_day=orders_per_day,
    )
