from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from app.db.session import get_db
from app.models.blog import BlogPost
from app.models.user import User, UserRole
from app.core.security import get_current_user_id

router = APIRouter()


# --- Schemas ---

class BlogCreate(BaseModel):
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    read_time: Optional[str] = None
    is_published: bool = False


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    read_time: Optional[str] = None
    is_published: Optional[bool] = None


class BlogResponse(BaseModel):
    id: str
    title: str
    slug: str
    content: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    author_id: Optional[str] = None
    category: Optional[str] = None
    read_time: Optional[str] = None
    is_published: bool
    published_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


async def _require_admin(user_id: str, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Требуются права администратора")
    return user


# --- Endpoints ---

@router.get("", response_model=List[BlogResponse])
async def list_blog_posts(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
):
    query = select(BlogPost).where(BlogPost.is_published == True)
    if category:
        query = query.where(BlogPost.category == category)
    query = query.order_by(BlogPost.published_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    result = await db.execute(query)
    posts = result.scalars().all()
    return [BlogResponse.model_validate(p) for p in posts]


@router.get("/{slug}", response_model=BlogResponse)
async def get_blog_post(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(BlogPost).where(BlogPost.slug == slug, BlogPost.is_published == True)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")

    return BlogResponse.model_validate(post)


@router.post("", response_model=BlogResponse)
async def create_blog_post(
    data: BlogCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _require_admin(user_id, db)

    # Check slug uniqueness
    result = await db.execute(select(BlogPost).where(BlogPost.slug == data.slug))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug уже занят")

    post = BlogPost(
        id=str(uuid4()),
        title=data.title,
        slug=data.slug,
        content=data.content,
        excerpt=data.excerpt,
        cover_image=data.cover_image,
        author_id=user_id,
        category=data.category,
        read_time=data.read_time,
        is_published=data.is_published,
        published_at=datetime.utcnow() if data.is_published else None,
    )

    db.add(post)
    await db.commit()
    await db.refresh(post)

    return BlogResponse.model_validate(post)


@router.put("/{post_id}", response_model=BlogResponse)
async def update_blog_post(
    post_id: str,
    data: BlogUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await _require_admin(user_id, db)

    result = await db.execute(select(BlogPost).where(BlogPost.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статья не найдена")

    if data.title is not None:
        post.title = data.title
    if data.slug is not None:
        # Check slug uniqueness
        result = await db.execute(
            select(BlogPost).where(BlogPost.slug == data.slug, BlogPost.id != post_id)
        )
        if result.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug уже занят")
        post.slug = data.slug
    if data.content is not None:
        post.content = data.content
    if data.excerpt is not None:
        post.excerpt = data.excerpt
    if data.cover_image is not None:
        post.cover_image = data.cover_image
    if data.category is not None:
        post.category = data.category
    if data.read_time is not None:
        post.read_time = data.read_time
    if data.is_published is not None:
        if data.is_published and not post.is_published:
            post.published_at = datetime.utcnow()
        post.is_published = data.is_published

    await db.commit()
    await db.refresh(post)

    return BlogResponse.model_validate(post)
