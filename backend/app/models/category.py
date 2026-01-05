from sqlalchemy import Column, String, Text, Integer, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base, TimestampMixin


class Category(Base, TimestampMixin):
    __tablename__ = "categories"
    
    id = Column(String, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String, nullable=True)
    image = Column(String, nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    skills = relationship("Skill", back_populates="category", cascade="all, delete-orphan")
    services = relationship("Service", back_populates="category")


class Skill(Base, TimestampMixin):
    __tablename__ = "skills"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False, index=True)
    category_id = Column(String, nullable=False)
    
    # Relationships
    category = relationship("Category", back_populates="skills")




