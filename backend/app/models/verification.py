from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base, TimestampMixin


class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    REJECTED = "rejected"


class VerificationRequest(Base, TimestampMixin):
    __tablename__ = "verification_requests"

    id = Column(String, primary_key=True)
    specialist_id = Column(String, ForeignKey("specialists.id", ondelete="CASCADE"), nullable=False, index=True)
    document_type = Column(String, nullable=False)  # passport, diploma, license, insurance
    status = Column(SQLEnum(VerificationStatus), default=VerificationStatus.PENDING)
    reviewer_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    # Relationships
    specialist = relationship("Specialist")
    reviewer = relationship("User", foreign_keys=[reviewer_id])
