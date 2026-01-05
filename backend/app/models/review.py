from sqlalchemy import Column, String, Integer, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Review(Base, TimestampMixin):
    __tablename__ = "reviews"
    
    id = Column(String, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    specialist_id = Column(String, ForeignKey("specialists.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False, index=True)
    comment = Column(Text, nullable=False)
    pros = Column(String, nullable=True)
    cons = Column(String, nullable=True)
    response = Column(Text, nullable=True)
    is_published = Column(Boolean, default=True)
    
    # Relationships
    order = relationship("Order", back_populates="review")
    user = relationship("User", back_populates="reviews")
    specialist = relationship("Specialist", back_populates="reviews")




