from pydantic import BaseModel, Field

class RegisterDto(BaseModel):
    first_name: str = Field(
        pattern=r"^[A-ZŻŹĆĄŚĘŁÓŃ][-'_.\sA-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{0,49}$",
        min_length=1, max_length=50
    )
    last_name: str = Field(
        pattern=r"^[A-ZŻŹĆĄŚĘŁÓŃ][-'_.\sA-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{0,49}$",
        min_length=1, max_length=50
    )
    username: str = Field(
        pattern=r"^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ][-'_.\sA-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]{0,49}$",
        min_length=1, max_length=50
    )
    email: str = Field(
        pattern=r"^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$" 
    )
    password: str = Field(
        # No look-arounds: just checks allowed chars and length
        pattern=r"^[0-9a-zA-Z!@#&()\[\]{}\:\;',?/*~$^+=<>.\-]{6,100}$",
        min_length=6, max_length=100
    )

class UserDto(BaseModel):
    first_name: str
    last_name: str
    username: str

class UserSchema(UserDto):
    id: int

    class Config:
        from_attributes = True