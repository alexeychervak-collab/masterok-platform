from sqlalchemy import Column, String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base, TimestampMixin


class UserRole(str, enum.Enum):
    CLIENT = "client"
    SPECIALIST = "specialist"
    ADMIN = "admin"


class User(Base, TimestampMixin):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.CLIENT, nullable=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    specialist = relationship("Specialist", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="client", foreign_keys="Order.client_id")
    reviews = relationship("Review", back_populates="user")




