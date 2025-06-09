from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from auth.models.login_response import LoginResponse
from auth.models.token import Token
from auth.service.auth_service import authenticate_user, create_access_token
from database_root.database_get import get_db
from user.models.user import User
from auth.utils.utils import get_password_hash
from user.models.user_response import UserResponse
from pydantic import BaseModel
import sqlalchemy as sa


user_router = APIRouter(
    prefix='/users',
    tags=['Users'],
)

class UserBase(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: str
    password: str

@user_router.post('/register')
def create_user(user: UserBase, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="User already exists")
    user.password = get_password_hash(user.password)
    db_user = User(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.flush(db_user)
    return "Created"
