from sqlalchemy import Column, String, Integer, ForeignKey
from app.db.base import Base, TimestampMixin


class Media(Base, TimestampMixin):
    __tablename__ = "media"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_type = Column(String, nullable=False, index=True)  # portfolio, chat, verification, progress, dispute
    entity_id = Column(String, nullable=False, index=True)
    file_path = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)
    thumbnail_path = Column(String, nullable=True)
