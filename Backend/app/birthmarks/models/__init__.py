from sqlalchemy import Boolean, Integer, String, BLOB, Column, Date, ForeignKey
from app.base.database import Base


class User(Base):
    __tablename__ = 'birthmarks'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    last_name = Column(String(50))
    username = Column(String(50), unique=True)
    email = Column(String(255), unique=True)
    password = Column(String(255))
    disabled = Column(Boolean, default=False)
    profile_picture = Column(BLOB)
