from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base, TimestampMixin


class BidStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"


class OrderBid(Base, TimestampMixin):
    __tablename__ = "order_bids"

    id = Column(String, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    specialist_id = Column(String, ForeignKey("specialists.id", ondelete="CASCADE"), nullable=False, index=True)
    price = Column(Float, nullable=False)
    timeline = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    status = Column(SQLEnum(BidStatus), default=BidStatus.PENDING)

    # Relationships
    order = relationship("Order", back_populates="bids")
    specialist = relationship("Specialist", back_populates="bids")
