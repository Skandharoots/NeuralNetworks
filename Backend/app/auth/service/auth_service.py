from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from users.models.user import User
from auth.models.token import TokenData
from auth.utils.utils import verify_password
from users.service.user_service import get_user_by_email
from base.get_db import get_db
from typing import Annotated, Optional
import jwt
from core.config_loader import settings

SECRET_KEY = settings.JWT_SECRET_KEY
AUTH_VALID = 60
REFRESH_VALID = (60 * 24 * 31)
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/api/auth/login')

def authenticate_user(email: str, password: str, db: Session):
    user = get_user_by_email(email, db)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except jwt.InvalidTokenError:
        raise credentials_exception
    if token_data.email is None:
        raise credentials_exception
    user = get_user_by_email(email=token_data.email, db=db)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user