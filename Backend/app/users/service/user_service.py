from sqlalchemy.orm.sync import update

from base.get_db import get_db
from sqlalchemy.orm import Session 
from fastapi import Depends, HTTPException
from users.models.dto import RegisterDto, UpdateDto
from users.models.user import User

def get_user_by_email(email: str, db: Session = Depends(get_db)):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(id: int, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == id).first()

def update_user_by_id(id: int, user: UpdateDto, db: Session = Depends(get_db)):
    userdb = db.query(User).filter(User.id == id).first()
    if userdb is None:
        raise HTTPException(status_code=404, detail="User not found")
    userdb.email = user.email
    userdb.first_name = user.first_name
    userdb.last_name = user.last_name
    db.commit()
    db.refresh(userdb)
    return userdb

def delete_user_by_id(id: int, db: Session = Depends(get_db)):
    userdb = db.query(User).filter(User.id == id).first()
    if userdb is None:
        raise HTTPException(status_code=404, detail="User not found")
    db.query(User).filter(User.id == id).delete()
    db.commit()
    db.flush()
    db.refresh(userdb)
    return "User deleted"

def picture_upload(id: int, fileName: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.id == id).first()
    if not users:
        raise HTTPException(status_code=404, detail="User not found")
    users.profile_picture = fileName
    db.commit()
    db.refresh(users)
    return users

def picture_get(id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found, cannot load picture")
    return db_user.profile_picture
