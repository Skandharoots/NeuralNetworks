from base.get_db import get_db
from sqlalchemy.orm import Session 
from fastapi import Depends, HTTPException, status
from users.models.user import User

def get_user_by_email(email: str, db: Session = Depends(get_db)):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(id: int, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == id).first()
    