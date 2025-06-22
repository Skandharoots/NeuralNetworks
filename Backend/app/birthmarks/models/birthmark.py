import datetime

from sqlalchemy import Integer, String, BLOB, Column, Date, ForeignKey
from base.database import Base


class Birthmark(Base):
    __tablename__ = 'birthmarks'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, nullable=False)
    user_id = Column(ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(Date, default=datetime.date.today(), nullable=False)
    diagnosis = Column(String(255), nullable=False)
