from sqlalchemy import Column, String, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class ProgressUpdate(Base, TimestampMixin):
    __tablename__ = "progress_updates"

    id = Column(String, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    milestone_id = Column(String, ForeignKey("milestones.id", ondelete="SET NULL"), nullable=True)
    specialist_id = Column(String, ForeignKey("specialists.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=False)
    progress_percent = Column(Integer, default=0)  # 0-100

    # Relationships
    order = relationship("Order")
    milestone = relationship("Milestone")
    specialist = relationship("Specialist")
