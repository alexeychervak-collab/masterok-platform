from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.db.session import get_db
from app.models.service import Service
from app.models.specialist import Specialist
from app.schemas.service import ServiceCreate, ServiceResponse
from app.core.security import get_current_user_id

router = APIRouter()


@router.get("/specialist/{specialist_id}", response_model=List[ServiceResponse])
async def get_specialist_services(
    specialist_id: str,
    db: AsyncSession = Depends(get_db)
):
    query = select(Service).where(
        Service.specialist_id == specialist_id,
        Service.is_active == True
    )
    
    result = await db.execute(query)
    services = result.scalars().all()
    
    return [ServiceResponse.model_validate(s) for s in services]


@router.post("", response_model=ServiceResponse)
async def create_service(
    data: ServiceCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Get specialist
    result = await db.execute(
        select(Specialist).where(Specialist.user_id == user_id)
    )
    specialist = result.scalar_one_or_none()
    
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом"
        )
    
    service = Service(
        id=str(uuid.uuid4()),
        specialist_id=specialist.id,
        category_id=data.category_id,
        name=data.name,
        description=data.description,
        price=data.price,
        price_unit=data.price_unit,
        duration=data.duration,
    )
    
    db.add(service)
    await db.commit()
    await db.refresh(service)
    
    return ServiceResponse.model_validate(service)


@router.delete("/{service_id}")
async def delete_service(
    service_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    # Get specialist
    result = await db.execute(
        select(Specialist).where(Specialist.user_id == user_id)
    )
    specialist = result.scalar_one_or_none()
    
    if not specialist:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Вы не являетесь специалистом"
        )
    
    # Get service
    result = await db.execute(
        select(Service).where(
            Service.id == service_id,
            Service.specialist_id == specialist.id
        )
    )
    service = result.scalar_one_or_none()
    
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Услуга не найдена"
        )
    
    await db.delete(service)
    await db.commit()
    
    return {"success": True}




