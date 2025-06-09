from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from auth.models.login_response import LoginResponse
from auth.models.token import Token
from auth.service.auth_service import authenticate_user, create_access_token
from database_root.database_get import get_db


auth_router = APIRouter(
    prefix='/auth',
    tags=['Auth'],
)

@auth_router.post('/login')
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
) -> LoginResponse:
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticated": "Bearer"}
        )
    access_token_expires = timedelta(minutes=1440)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return LoginResponse(username=user.username, first_name=user.first_name, token=access_token, type="bearer")