from sqlalchemy import Column, String, Integer, Float, Boolean, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base, TimestampMixin


class SkillLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class Specialist(Base, TimestampMixin):
    __tablename__ = "specialists"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    city = Column(String, nullable=False, index=True)
    address = Column(String, nullable=True)
    experience = Column(Integer, default=0)
    rating = Column(Float, default=0.0, index=True)
    review_count = Column(Integer, default=0)
    completed_orders = Column(Integer, default=0)
    response_time = Column(Integer, default=60)  # minutes
    is_verified = Column(Boolean, default=False, index=True)
    is_premium = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    education = Column(String, nullable=True)
    work_schedule = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="specialist")
    skills = relationship("SpecialistSkill", back_populates="specialist", cascade="all, delete-orphan")
    services = relationship("Service", back_populates="specialist", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="specialist")
    reviews = relationship("Review", back_populates="specialist")


class SpecialistSkill(Base, TimestampMixin):
    __tablename__ = "specialist_skills"
    
    id = Column(String, primary_key=True)
    specialist_id = Column(String, ForeignKey("specialists.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(String, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    level = Column(SQLEnum(SkillLevel), default=SkillLevel.INTERMEDIATE)
    years_exp = Column(Integer, default=0)
    
    # Relationships
    specialist = relationship("Specialist", back_populates="skills")
    skill = relationship("Skill")




