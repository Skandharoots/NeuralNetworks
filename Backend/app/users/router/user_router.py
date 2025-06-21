from fastapi import APIRouter, Depends, HTTPException, status, File, Form, UploadFile
from auth.service.auth_service import get_current_active_user
from users.models.dto import RegisterDto, UserDto, UserSchema, UpdateDto, UserImgDto
from users.models.user import User
from sqlalchemy.orm import Session
from base.get_db import get_db
from users.service.user_service import update_user_by_id, delete_user_by_id, picture_upload, picture_get, picture_delete
from auth.utils.utils import get_password_hash

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
async def user_get(current_user: User = Depends(get_current_active_user)):
    return current_user

@user_router.put("/me", response_model=UserSchema)
async def update_user(user: UpdateDto, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return update_user_by_id(current_user.id, user, db)

@user_router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def user_delete(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    delete_user_by_id(current_user.id, db)

@user_router.post("/picture", response_model=None)
async def upload_picture(file: UploadFile = File(...), current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return await picture_upload(current_user.id, file, db)

@user_router.get("/picture", response_model=None)
async def get_picture(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return picture_get(current_user.id, db)

@user_router.delete("/picture", status_code=status.HTTP_204_NO_CONTENT)
async def delete_picture(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return picture_delete(current_user.id, db)
