from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form
from auth.service.auth_service import get_current_active_user
from sqlalchemy.orm import Session
from base.get_db import get_db
from birthmarks.models.dto import BirthmarkDto
from birthmarks.service.birthmark_service import get_birthmarks_by_user_id, create_birthmark, delete_birthmark, get_image_birthmark
from typing import Annotated

from users.models.user import User

birthmark_router = APIRouter(
    prefix="/birthmarks",
    tags=["Birthmarks"],
)

@birthmark_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(file: UploadFile, fileName: str = Form(...), current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    if not file:
        raise HTTPException(status_code=400, detail="No file sent with request.")
    if not fileName:
        raise HTTPException(status_code=400, detail="No file name sent with request.")
    return await create_birthmark(file, fileName, current_user, db)

@birthmark_router.get("/get", status_code=status.HTTP_200_OK, response_model=list[BirthmarkDto])
async def get_birthmark(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return get_birthmarks_by_user_id(current_user, db)

@birthmark_router.get("/get/image/{id}", status_code=status.HTTP_200_OK, response_model=None)
async def get_image(id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return get_image_birthmark(id, db)

@birthmark_router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_birk(id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return delete_birthmark(id, db)