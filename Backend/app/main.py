from fastapi import FastAPI
from app.base.database import engine
import app.users.models
from app.users.models.user import Base
from app.users.router.user_router import user_router
from app.auth.router.auth_router import auth_router
from fastapi.middleware.cors import CORSMiddleware

openapi_tags=[
    {
        "name": "Users",
        "description": "Users app",
    },
    {
        "name": "Auth",
        "description": "User authentication",
    },
    {
        "name": "Home",
        "desctiption": "Welcome page",
    },
]

app = FastAPI(openapi_tags=openapi_tags)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user_router, prefix='/api', tags=["Users"])
app.include_router(auth_router, prefix='/api', tags=["Auth"])


@app.get("/")
def root():
    return "Welcome"

