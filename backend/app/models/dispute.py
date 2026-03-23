from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base, TimestampMixin


class DisputeStatus(str, enum.Enum):
    OPEN = "open"
    UNDER_REVIEW = "under_review"
    RESOLVED_CLIENT = "resolved_client"
    RESOLVED_SPECIALIST = "resolved_specialist"
    RESOLVED_SPLIT = "resolved_split"
    CLOSED = "closed"


class Dispute(Base, TimestampMixin):
    __tablename__ = "disputes"

    id = Column(String, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    opened_by = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(SQLEnum(DisputeStatus), default=DisputeStatus.OPEN)
    resolution_note = Column(Text, nullable=True)
    resolved_by = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    order = relationship("Order")
    opener = relationship("User", foreign_keys=[opened_by])
    resolver = relationship("User", foreign_keys=[resolved_by])


class DisputeEvidence(Base, TimestampMixin):
    __tablename__ = "dispute_evidence"

    id = Column(String, primary_key=True)
    dispute_id = Column(String, ForeignKey("disputes.id", ondelete="CASCADE"), nullable=False, index=True)
    submitted_by = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=False)

    # Relationships
    dispute = relationship("Dispute")
    submitter = relationship("User", foreign_keys=[submitted_by])
