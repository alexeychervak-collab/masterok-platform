"""
File storage service for uploads.
Stores files locally in /data/uploads/ with UUID names, served by nginx.
"""

import os
import uuid
import logging
from pathlib import Path
from typing import Optional
from fastapi import UploadFile

log = logging.getLogger(__name__)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/data/uploads")
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_DOC_TYPES = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_DOC_SIZE = 25 * 1024 * 1024  # 25MB

SUBFOLDERS = ["portfolios", "documents", "chat", "progress", "disputes", "avatars"]


def ensure_directories():
    """Create upload subdirectories if they don't exist."""
    for folder in SUBFOLDERS:
        Path(UPLOAD_DIR, folder).mkdir(parents=True, exist_ok=True)


async def save_upload(
    file: UploadFile,
    folder: str,
    user_id: str,
) -> dict:
    """
    Save an uploaded file to disk.
    Returns dict with file_path, file_name, file_size, mime_type.
    """
    if folder not in SUBFOLDERS:
        raise ValueError(f"Invalid folder: {folder}")

    content_type = file.content_type or "application/octet-stream"
    is_image = content_type in ALLOWED_IMAGE_TYPES
    is_doc = content_type in ALLOWED_DOC_TYPES

    if not is_image and not is_doc:
        raise ValueError(f"File type not allowed: {content_type}")

    # Read file content
    content = await file.read()
    file_size = len(content)

    max_size = MAX_IMAGE_SIZE if is_image else MAX_DOC_SIZE
    if file_size > max_size:
        raise ValueError(f"File too large: {file_size} bytes (max {max_size})")

    # Generate unique filename
    ext = Path(file.filename or "file").suffix or (".jpg" if is_image else ".pdf")
    unique_name = f"{uuid.uuid4().hex}{ext}"
    relative_path = f"{folder}/{unique_name}"
    absolute_path = os.path.join(UPLOAD_DIR, relative_path)

    # Ensure directory exists
    os.makedirs(os.path.dirname(absolute_path), exist_ok=True)

    # Write file
    with open(absolute_path, "wb") as f:
        f.write(content)

    # Generate thumbnail for images
    thumbnail_path = None
    if is_image:
        thumbnail_path = await _create_thumbnail(content, folder, unique_name)

    log.info(f"File saved: {relative_path} ({file_size} bytes) by user {user_id}")

    return {
        "file_path": relative_path,
        "file_name": file.filename or unique_name,
        "file_size": file_size,
        "mime_type": content_type,
        "thumbnail_path": thumbnail_path,
    }


async def _create_thumbnail(
    content: bytes, folder: str, filename: str, size: tuple = (300, 300)
) -> Optional[str]:
    """Create a thumbnail for an image file."""
    try:
        from PIL import Image
        import io

        img = Image.open(io.BytesIO(content))
        img.thumbnail(size)

        thumb_name = f"thumb_{filename}"
        thumb_relative = f"{folder}/{thumb_name}"
        thumb_absolute = os.path.join(UPLOAD_DIR, thumb_relative)

        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        img.save(thumb_absolute, "JPEG", quality=85)

        return thumb_relative
    except Exception as e:
        log.warning(f"Thumbnail creation failed: {e}")
        return None


def delete_file(file_path: str):
    """Delete a file from disk."""
    absolute_path = os.path.join(UPLOAD_DIR, file_path)
    try:
        if os.path.exists(absolute_path):
            os.remove(absolute_path)
            log.info(f"File deleted: {file_path}")
    except Exception as e:
        log.error(f"Failed to delete file {file_path}: {e}")


def get_url(file_path: str) -> str:
    """Get the public URL for a file."""
    return f"/uploads/{file_path}"
