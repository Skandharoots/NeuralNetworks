from sqlalchemy.orm.sync import update

from app.base.get_db import get_db
from sqlalchemy.orm import Session 
from fastapi import Depends, HTTPException, status, UploadFile

from app.birthmarks.service.birthmark_service import upload_to_azure, read_from_azure
from app.users.models.dto import RegisterDto, UpdateDto
from app.users.models.user import User

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

async def upload_profile_picture(id: int, file: UploadFile):
    await upload_to_azure(file, str(id), "pictures")

async def get_profile_picture(id: int, container_name: str):
    return read_from_azure(str(id), container_name)