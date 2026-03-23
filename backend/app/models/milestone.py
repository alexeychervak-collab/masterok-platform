from sqlalchemy import Column, String, Float, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base, TimestampMixin


class MilestoneStatus(str, enum.Enum):
    PENDING = "pending"
    FUNDED = "funded"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    RELEASED = "released"
    DISPUTED = "disputed"


class Milestone(Base, TimestampMixin):
    __tablename__ = "milestones"

    id = Column(String, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    amount = Column(Float, nullable=False)
    sequence = Column(Integer, nullable=False)
    status = Column(SQLEnum(MilestoneStatus), default=MilestoneStatus.PENDING)
    due_date = Column(DateTime, nullable=True)
    payment_id = Column(String, ForeignKey("payments.id", ondelete="SET NULL"), nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)

    # Relationships
    order = relationship("Order", back_populates="milestones")
    payment = relationship("Payment")
