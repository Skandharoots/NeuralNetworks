from pydantic import BaseModel

class LoginResponse(BaseModel):
    username: str
    first_name: str
    token: str
    type: str