from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4

from app.db.session import get_db
from app.models.media import Media
from app.core.security import get_current_user_id
from app.services.storage_service import save_upload, get_url

router = APIRouter()


class MediaResponse(BaseModel):
    id: str
    entity_type: str
    entity_id: str
    file_path: str
    file_name: str
    file_size: int
    mime_type: str
    thumbnail_path: Optional[str] = None
    url: str

    class Config:
        from_attributes = True


@router.post("", response_model=MediaResponse)
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form(...),
    entity_type: str = Form(...),
    entity_id: str = Form(...),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    try:
        result = await save_upload(file=file, folder=folder, user_id=user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    media = Media(
        id=str(uuid4()),
        user_id=user_id,
        entity_type=entity_type,
        entity_id=entity_id,
        file_path=result["file_path"],
        file_name=result["file_name"],
        file_size=result["file_size"],
        mime_type=result["mime_type"],
        thumbnail_path=result.get("thumbnail_path"),
    )

    db.add(media)
    await db.commit()
    await db.refresh(media)

    return MediaResponse(
        id=media.id,
        entity_type=media.entity_type,
        entity_id=media.entity_id,
        file_path=media.file_path,
        file_name=media.file_name,
        file_size=media.file_size,
        mime_type=media.mime_type,
        thumbnail_path=media.thumbnail_path,
        url=get_url(media.file_path),
    )
