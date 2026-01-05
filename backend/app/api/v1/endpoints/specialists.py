from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import Optional
import uuid

from app.db.session import get_db
from app.models.specialist import Specialist, SpecialistSkill
from app.models.user import User, UserRole
from app.schemas.specialist import SpecialistCreate, SpecialistResponse, SpecialistListResponse, SkillInfo
from app.core.security import get_current_user_id

router = APIRouter()


@router.get("", response_model=SpecialistListResponse)
async def get_specialists(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    city: Optional[str] = None,
    category: Optional[str] = None,
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    verified_only: bool = False,
    search: Optional[str] = None,
    sort_by: str = Query("rating", regex="^(rating|reviews|experience|price)$"),
):
    # Base query
    query = select(Specialist).options(
        selectinload(Specialist.user),
        selectinload(Specialist.skills).selectinload(SpecialistSkill.skill)
    )
    
    # Filters
    if city:
        query = query.where(Specialist.city == city)
    if min_rating:
        query = query.where(Specialist.rating >= min_rating)
    if verified_only:
        query = query.where(Specialist.is_verified == True)
    if search:
        query = query.where(Specialist.title.ilike(f"%{search}%"))
    
    # Only available
    query = query.where(Specialist.is_available == True)
    
    # Sorting
    if sort_by == "rating":
        query = query.order_by(Specialist.rating.desc())
    elif sort_by == "reviews":
        query = query.order_by(Specialist.review_count.desc())
    elif sort_by == "experience":
        query = query.order_by(Specialist.experience.desc())
    
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Pagination
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    result = await db.execute(query)
    specialists = result.scalars().all()
    
    items = []
    for s in specialists:
        item = SpecialistResponse(
            id=s.id,
            user_id=s.user_id,
            title=s.title,
            description=s.description,
            city=s.city,
            experience=s.experience,
            rating=s.rating,
            review_count=s.review_count,
            completed_orders=s.completed_orders,
            response_time=s.response_time,
            is_verified=s.is_verified,
            is_premium=s.is_premium,
            is_available=s.is_available,
            education=s.education,
            created_at=s.created_at,
            user_name=s.user.name if s.user else None,
            user_avatar=s.user.avatar if s.user else None,
            skills=[
                SkillInfo(
                    id=ss.skill.id,
                    name=ss.skill.name,
                    level=ss.level.value,
                    years_exp=ss.years_exp
                ) for ss in s.skills if ss.skill
            ]
        )
        items.append(item)
    
    return SpecialistListResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        pages=(total + per_page - 1) // per_page
    )


@router.get("/{specialist_id}", response_model=SpecialistResponse)
async def get_specialist(specialist_id: str, db: AsyncSession = Depends(get_db)):
    query = select(Specialist).options(
        selectinload(Specialist.user),
        selectinload(Specialist.skills).selectinload(SpecialistSkill.skill)
    ).where(Specialist.id == specialist_id)
    
    result = await db.execute(query)
    s = result.scalar_one_or_none()
    
    if not s:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Специалист не найден"
        )
    
    return SpecialistResponse(
        id=s.id,
        user_id=s.user_id,
        title=s.title,
        description=s.description,
        city=s.city,
        experience=s.experience,
        rating=s.rating,
        review_count=s.review_count,
        completed_orders=s.completed_orders,
        response_time=s.response_time,
        is_verified=s.is_verified,
        is_premium=s.is_premium,
        is_available=s.is_available,
        education=s.education,
        created_at=s.created_at,
        user_name=s.user.name if s.user else None,
        user_avatar=s.user.avatar if s.user else None,
        skills=[
            SkillInfo(
                id=ss.skill.id,
                name=ss.skill.name,
                level=ss.level.value,
                years_exp=ss.years_exp
            ) for ss in s.skills if ss.skill
        ]
    )


@router.post("", response_model=SpecialistResponse)
async def create_specialist(
    data: SpecialistCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Check if already specialist
    result = await db.execute(select(Specialist).where(Specialist.user_id == user_id))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы уже зарегистрированы как специалист"
        )
    
    # Update user role
    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalar_one_or_none()
    if user:
        user.role = UserRole.SPECIALIST
    
    # Create specialist
    specialist = Specialist(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=data.title,
        description=data.description,
        city=data.city,
        experience=data.experience,
        education=data.education,
    )
    
    db.add(specialist)
    await db.commit()
    await db.refresh(specialist)
    
    return SpecialistResponse(
        id=specialist.id,
        user_id=specialist.user_id,
        title=specialist.title,
        description=specialist.description,
        city=specialist.city,
        experience=specialist.experience,
        rating=specialist.rating,
        review_count=specialist.review_count,
        completed_orders=specialist.completed_orders,
        response_time=specialist.response_time,
        is_verified=specialist.is_verified,
        is_premium=specialist.is_premium,
        is_available=specialist.is_available,
        education=specialist.education,
        created_at=specialist.created_at,
        user_name=user.name if user else None,
        user_avatar=user.avatar if user else None,
        skills=[]
    )




