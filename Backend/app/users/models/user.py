from sqlalchemy import Boolean, Integer, String, Date, Column
from app.base.database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    username = Column(String(50), unique=True)
    email = Column(String(255), unique=True)
    password = Column(String(255))
    disabled = Column(Boolean, default=False)
    