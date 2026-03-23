from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from datetime import datetime

from app.db.session import get_db
from app.models.portfolio import PortfolioProject
from app.models.media import Media
from app.models.specialist import Specialist
from app.core.security import get_current_user_id
from app.services.storage_service import get_url

router = APIRouter()


class PortfolioCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    duration_days: Optional[int] = None
    cost: Optional[float] = None


class PortfolioUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[str] = None
    duration_days: Optional[int] = None
    cost: Optional[float] = None


class MediaInfo(BaseModel):
    id: str
    url: str
    file_name: str
    mime_type: str


class PortfolioResponse(BaseModel):
    id: str
    specialist_id: str
    title: str
    description: Optional[str] = None
    category_id: Optional[str] = None
    duration_days: Optional[int] = None
    cost: Optional[float] = None
    created_at: datetime
    media: List[MediaInfo] = []

    class Config:
        from_attributes = True


async def _get_specialist_for_user(db: AsyncSession, user_id: str) -> Specialist:
    result = await db.execute(select(Specialist).where(Specialist.user_id == user_id))
    specialist = result.scalar_one_or_none()
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом",
        )
    return specialist


async def _attach_media(db: AsyncSession, projects: list) -> List[PortfolioResponse]:
    """Attach media files to portfolio projects."""
    responses = []
    for p in projects:
        result = await db.execute(
            select(Media).where(
                Media.entity_type == "portfolio",
                Media.entity_id == p.id,
            )
        )
        media_items = result.scalars().all()
        media_list = [
            MediaInfo(id=m.id, url=get_url(m.file_path), file_name=m.file_name, mime_type=m.mime_type)
            for m in media_items
        ]
        resp = PortfolioResponse(
            id=p.id,
            specialist_id=p.specialist_id,
            title=p.title,
            description=p.description,
            category_id=p.category_id,
            duration_days=p.duration_days,
            cost=p.cost,
            created_at=p.created_at,
            media=media_list,
        )
        responses.append(resp)
    return responses


@router.post("/specialists/{specialist_id}/portfolio", response_model=PortfolioResponse)
async def create_portfolio_project(
    specialist_id: str,
    data: PortfolioCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    specialist = await _get_specialist_for_user(db, user_id)
    if specialist.id != specialist_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Нет доступа")

    project = PortfolioProject(
        id=str(uuid4()),
        specialist_id=specialist_id,
        title=data.title,
        description=data.description,
        category_id=data.category_id,
        duration_days=data.duration_days,
        cost=data.cost,
    )

    db.add(project)
    await db.commit()
    await db.refresh(project)

    result = await _attach_media(db, [project])
    return result[0]


@router.get("/specialists/{specialist_id}/portfolio", response_model=List[PortfolioResponse])
async def get_portfolio_projects(
    specialist_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(PortfolioProject)
        .where(PortfolioProject.specialist_id == specialist_id)
        .order_by(PortfolioProject.created_at.desc())
    )
    projects = result.scalars().all()
    return await _attach_media(db, projects)


@router.put("/portfolio/{project_id}", response_model=PortfolioResponse)
async def update_portfolio_project(
    project_id: str,
    data: PortfolioUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    specialist = await _get_specialist_for_user(db, user_id)

    result = await db.execute(select(PortfolioProject).where(PortfolioProject.id == project_id))
    project = result.scalar_one_or_none()
    if not project or project.specialist_id != specialist.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Проект не найден")

    if data.title is not None:
        project.title = data.title
    if data.description is not None:
        project.description = data.description
    if data.category_id is not None:
        project.category_id = data.category_id
    if data.duration_days is not None:
        project.duration_days = data.duration_days
    if data.cost is not None:
        project.cost = data.cost

    await db.commit()
    await db.refresh(project)

    result = await _attach_media(db, [project])
    return result[0]


@router.delete("/portfolio/{project_id}")
async def delete_portfolio_project(
    project_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    specialist = await _get_specialist_for_user(db, user_id)

    result = await db.execute(select(PortfolioProject).where(PortfolioProject.id == project_id))
    project = result.scalar_one_or_none()
    if not project or project.specialist_id != specialist.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Проект не найден")

    await db.delete(project)
    await db.commit()

    return {"success": True}
