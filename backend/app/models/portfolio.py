from sqlalchemy import Column, String, Integer, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class PortfolioProject(Base, TimestampMixin):
    __tablename__ = "portfolio_projects"

    id = Column(String, primary_key=True)
    specialist_id = Column(String, ForeignKey("specialists.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(String, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    duration_days = Column(Integer, nullable=True)
    cost = Column(Float, nullable=True)

    # Relationships
    specialist = relationship("Specialist", back_populates="portfolio_projects")
    category = relationship("Category")
