from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from auth.service.auth_service import get_current_active_user
from sqlalchemy.orm import Session
from base.get_db import get_db
from birthmarks.models.birthmark import Birthmark
from birthmarks.models.dto import BirthmarkDto, BirthmarkImgDto
from birthmarks.service.birthmark_service import get_birthmarks_by_user_id, create_birthmark, delete_birthmark, read_from_azure
from typing import Annotated

from users.models.user import User

birthmark_router = APIRouter(
    prefix="/birthmarks",
    tags=["Birthmarks"],
)

@birthmark_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(file: UploadFile, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    if not file:
        raise HTTPException(status_code=400, detail="No file sent with request.")
    return await create_birthmark(file, current_user, db)

@birthmark_router.get("/get", status_code=status.HTTP_200_OK, response_model=list[BirthmarkDto])
async def get_birthmark(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return get_birthmarks_by_user_id(current_user, db)

@birthmark_router.get("/get/image/{id}", status_code=status.HTTP_200_OK, response_model=None)
async def get_image(id: int, current_user: User = Depends(get_current_active_user),):
    return read_from_azure(str(id), "birk")

@birthmark_router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_birk(id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return delete_birthmark(id, db)