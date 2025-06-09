from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from users.service.user_service import get_user_by_email
from users.models.user import User
from auth.service.auth_service import authenticate_user, create_access_token, get_current_active_user
from base.get_db import get_db
from auth.models.token import Token

AUTH_VALID = 60
REFRESH_VALID = (60 * 24 * 31)

auth_router = APIRouter(
    prefix='/auth',
    tags=['Auth']
)

@auth_router.post('/login')
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
) -> Token:
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticated": "Bearer"},
        )
    access_token_expires = timedelta(minutes=AUTH_VALID)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")