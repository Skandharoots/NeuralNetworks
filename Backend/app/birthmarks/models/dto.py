import datetime
from typing import Annotated

import annotated_types
from pydantic import BaseModel, Field, Strict


class BirthmarkDto(BaseModel):
    id: int
    user_id: int
    date_created: datetime.date
    diagnosis: str