from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, Form, File
from auth.service.auth_service import get_current_active_user
from sqlalchemy.orm import Session
from base.get_db import get_db
from birthmarks.models.dto import BirthmarkDto
from birthmarks.service.birthmark_service import get_birthmarks_by_user_id, create_birthmark, delete_birthmark, get_birthmarks_by_user_id_and_diagnosis, get_image_birthmark, upload_to_azure
from typing import Annotated

from users.models.user import User

birthmark_router = APIRouter(
    prefix="/birthmarks",
    tags=["Birthmarks"],
)

@birthmark_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(file: UploadFile = File(...), current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    if not file:
        raise HTTPException(status_code=400, detail="No file sent with request.")
    return await create_birthmark(current_user.id, file, db)

@birthmark_router.post("/picture", response_model=None ,status_code=status.HTTP_201_CREATED)
async def upload_picture(id: int = Form(...), file: UploadFile = File(...), current_user: User = Depends(get_current_active_user)):
    return await upload_to_azure(file, "birthmarks/" + str(id), 'birk')

@birthmark_router.get("/get", status_code=status.HTTP_200_OK, response_model=list[BirthmarkDto])
async def get_birthmark(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return get_birthmarks_by_user_id(current_user, db)

@birthmark_router.get("/diagnosis/{diagnosis}", status_code=status.HTTP_200_OK, response_model=list[BirthmarkDto])
async def get_birthmark_by_diagnosis(diagnosis: str, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return get_birthmarks_by_user_id_and_diagnosis(diagnosis, current_user, db)

@birthmark_router.get("/get/image/{id}", response_model=None)
async def get_image(id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return get_image_birthmark(id, db)

@birthmark_router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_birk(id: int, current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return delete_birthmark(id, db)