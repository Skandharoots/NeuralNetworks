from fastapi import HTTPException, Depends
from database_root.database_get import get_db
from sqlalchemy.orm import Session
from user.models.user import User
from user.models.user_response import UserResponse

def get_user_by_email(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user