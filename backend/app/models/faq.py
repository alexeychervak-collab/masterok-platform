from sqlalchemy import Column, String, Text, Integer, Boolean
from app.db.base import Base, TimestampMixin


class FaqItem(Base, TimestampMixin):
    __tablename__ = "faq_items"

    id = Column(String, primary_key=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    category = Column(String, nullable=True, index=True)
    sort_order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
