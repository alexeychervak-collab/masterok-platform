from sqlalchemy import Column, String, Text, Boolean, ForeignKey
from app.db.base import Base, TimestampMixin


class SavedSearch(Base, TimestampMixin):
    __tablename__ = "saved_searches"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    query = Column(String, nullable=False)
    filters = Column(Text, nullable=True)  # JSON string
    notification_enabled = Column(Boolean, default=False)
