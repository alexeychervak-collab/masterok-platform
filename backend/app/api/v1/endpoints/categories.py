from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.models.category import Category, Skill
from app.schemas.category import CategoryResponse, SkillResponse

router = APIRouter()


@router.get("", response_model=List[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    query = select(Category).options(
        selectinload(Category.skills)
    ).where(Category.is_active == True).order_by(Category.order)
    
    result = await db.execute(query)
    categories = result.scalars().all()
    
    return [
        CategoryResponse(
            id=c.id,
            name=c.name,
            slug=c.slug,
            description=c.description,
            icon=c.icon,
            image=c.image,
            order=c.order,
            skills=[
                SkillResponse(
                    id=s.id,
                    name=s.name,
                    slug=s.slug,
                    category_id=s.category_id
                ) for s in c.skills
            ]
        ) for c in categories
    ]


@router.get("/{slug}", response_model=CategoryResponse)
async def get_category(slug: str, db: AsyncSession = Depends(get_db)):
    query = select(Category).options(
        selectinload(Category.skills)
    ).where(Category.slug == slug)
    
    result = await db.execute(query)
    c = result.scalar_one_or_none()
    
    if not c:
        return None
    
    return CategoryResponse(
        id=c.id,
        name=c.name,
        slug=c.slug,
        description=c.description,
        icon=c.icon,
        image=c.image,
        order=c.order,
        skills=[
            SkillResponse(
                id=s.id,
                name=s.name,
                slug=s.slug,
                category_id=s.category_id
            ) for s in c.skills
        ]
    )




