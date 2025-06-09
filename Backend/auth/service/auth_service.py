import datetime
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from jwt.exceptions import InvalidTokenError
import jwt
from auth.models.token import TokenData
from auth.utils.utils import verify_password
from datetime import timedelta, timezone, datetime
from database_root.database_get import get_db
from user.models.user import User
from user.service.user_service import get_user_by_email

SECRET_KEY = "613d004e29a57a90b65eba14d1a6bdb71c9f5973ff5bbf55f5321f314c92b228e5c73e3d7487d3228b007821c69cf6b19c680136362b1394d70491cea2e560d7d5cec9459ad3b9b782248b3faadc9ced856068b32743ec84ee262109ef1bbea03646664992ae1d85e4eea26f4c36cba64dec7b58ce3eabf796b91ca9760cbda543e5f74c9decb573df7013416c11a948da06d736088ea78487189c206f5d6ab479bc15751d627d0716e79dccff6dd6da450788b943e77a94204400a2e0cf9f4b53ae70c077771057938bd73fe1aa03e5718907e4c538eddf816cea5a4e6b2971d43dda7aff4947f2ae51871f4ad3aaad79efcdb120df3e4521aca172387acf37"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_MINUTES = (60 * 24 * 31)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def authenticate_user(email: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        epxire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        epxire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
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
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user
        