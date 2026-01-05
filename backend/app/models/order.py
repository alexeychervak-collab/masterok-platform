from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base, TimestampMixin


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DISPUTED = "disputed"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    HELD = "held"
    RELEASED = "released"
    REFUNDED = "refunded"


class Order(Base, TimestampMixin):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True)
    client_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    specialist_id = Column(String, ForeignKey("specialists.id", ondelete="CASCADE"), nullable=False)
    service_id = Column(String, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(String, nullable=True)
    scheduled_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    total_price = Column(Float, nullable=False)
    specialist_price = Column(Float, nullable=False)
    platform_fee = Column(Float, nullable=False)
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING, index=True)
    payment_status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.PENDING)
    
    # Relationships
    client = relationship("User", back_populates="orders", foreign_keys=[client_id])
    specialist = relationship("Specialist", back_populates="orders")
    service = relationship("Service", back_populates="orders")
    review = relationship("Review", back_populates="order", uselist=False)




