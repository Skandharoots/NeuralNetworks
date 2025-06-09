from pydantic import BaseModel

class Token(BaseModel):
    token: str
    type: str

class TokenData(BaseModel):
    email: str | None = None