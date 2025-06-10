from fastapi import APIRouter, Depends, HTTPException, status
from app.auth.service.auth_service import get_current_active_user
from app.users.models.dto import RegisterDto, UserDto, UserSchema
from app.users.models.user import User
from sqlalchemy.orm import Session
from app.base.get_db import get_db
from app.users.service.user_service import get_user_by_email, get_user_by_id
from app.auth.utils.utils import get_password_hash
from typing import Annotated

user_router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@user_router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(dto: RegisterDto, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == dto.email).first()
    if user:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Email already taken")
    dto.password = get_password_hash(dto.password)
    db_user = User(**dto.model_dump())
    db.add(db_user)
    db.commit()
    return "Created"

@user_router.get("/me", response_model=UserSchema)
def user_get(current_user: User = Depends(get_current_active_user)):
    return current_user


@user_router.get("/get", status_code=status.HTTP_200_OK, response_model=UserSchema)
def get_by_email(email: str, db: Session = Depends(get_db)):
    user = get_user_by_email(email, db)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

@user_router.get("/get/{id}", status_code=status.HTTP_200_OK, response_model=UserSchema)
def get_by_id(id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(id, db)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
