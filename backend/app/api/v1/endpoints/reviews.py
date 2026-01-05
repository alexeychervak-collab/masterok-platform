from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.db.session import get_db
from app.models.review import Review
from app.models.order import Order, OrderStatus
from app.models.specialist import Specialist
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewResponse
from app.core.security import get_current_user_id

router = APIRouter()


@router.get("/specialist/{specialist_id}", response_model=List[ReviewResponse])
async def get_specialist_reviews(
    specialist_id: str,
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
):
    query = select(Review).options(
        selectinload(Review.user)
    ).where(
        Review.specialist_id == specialist_id,
        Review.is_published == True
    ).order_by(Review.created_at.desc())
    
    query = query.offset((page - 1) * per_page).limit(per_page)
    
    result = await db.execute(query)
    reviews = result.scalars().all()
    
    return [
        ReviewResponse(
            id=r.id,
            order_id=r.order_id,
            user_id=r.user_id,
            specialist_id=r.specialist_id,
            rating=r.rating,
            comment=r.comment,
            pros=r.pros,
            cons=r.cons,
            response=r.response,
            is_published=r.is_published,
            created_at=r.created_at,
            user_name=r.user.name if r.user else None,
            user_avatar=r.user.avatar if r.user else None,
        ) for r in reviews
    ]


@router.post("", response_model=ReviewResponse)
async def create_review(
    data: ReviewCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Check order exists and is completed
    result = await db.execute(
        select(Order).where(
            Order.id == data.order_id,
            Order.client_id == user_id
        )
    )
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Заказ не найден"
        )
    
    if order.status != OrderStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Можно оставить отзыв только на завершённый заказ"
        )
    
    # Check if review already exists
    result = await db.execute(
        select(Review).where(Review.order_id == data.order_id)
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Отзыв на этот заказ уже оставлен"
        )
    
    # Get user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    # Create review
    review = Review(
        id=str(uuid.uuid4()),
        order_id=data.order_id,
        user_id=user_id,
        specialist_id=order.specialist_id,
        rating=data.rating,
        comment=data.comment,
        pros=data.pros,
        cons=data.cons,
    )
    
    db.add(review)
    
    # Update specialist rating
    result = await db.execute(
        select(Specialist).where(Specialist.id == order.specialist_id)
    )
    specialist = result.scalar_one_or_none()
    
    if specialist:
        # Calculate new average rating
        result = await db.execute(
            select(func.avg(Review.rating)).where(
                Review.specialist_id == specialist.id,
                Review.is_published == True
            )
        )
        avg_rating = result.scalar() or data.rating
        
        specialist.rating = round(float(avg_rating), 2)
        specialist.review_count += 1
    
    await db.commit()
    await db.refresh(review)
    
    return ReviewResponse(
        id=review.id,
        order_id=review.order_id,
        user_id=review.user_id,
        specialist_id=review.specialist_id,
        rating=review.rating,
        comment=review.comment,
        pros=review.pros,
        cons=review.cons,
        response=review.response,
        is_published=review.is_published,
        created_at=review.created_at,
        user_name=user.name if user else None,
        user_avatar=user.avatar if user else None,
    )




