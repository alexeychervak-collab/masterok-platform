from sqlalchemy import Column, String, Float, Integer, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Service(Base, TimestampMixin):
    __tablename__ = "services"
    
    id = Column(String, primary_key=True)
    specialist_id = Column(String, ForeignKey("specialists.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(String, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    price_unit = Column(String, default="за услугу")
    duration = Column(Integer, nullable=True)  # minutes
    is_active = Column(Boolean, default=True)
    
    # Relationships
    specialist = relationship("Specialist", back_populates="services")
    category = relationship("Category", back_populates="services")
    orders = relationship("Order", back_populates="service")




