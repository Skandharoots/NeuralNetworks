from sqlalchemy import Boolean, Column, Integer, String, Date
from database_root.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    first_name = Column(String(50), unique=False)
    last_name = Column(String(50), unique=False)
    email = Column(String(255), unique=True)
    password = Column(String(255))
    disabled = Column(Boolean, default=False)