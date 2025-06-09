from pydantic import BaseModel

class UserResponse(BaseModel):
    username: str
    first_name: str
    last_name: str