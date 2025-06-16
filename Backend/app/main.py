from fastapi import FastAPI
from base.database import engine
import users.models
from users.models.user import Base
from users.router.user_router import user_router
from auth.router.auth_router import auth_router
from birthmarks.router.birthmark_router import birthmark_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.formparsers import MultiPartParser

MultiPartParser.max_part_size = 25 * 1024 * 1024  # 25MB
MultiPartParser.max_file_size = 25 * 1024 * 1024   # 25MB

openapi_tags=[
    {
        "name": "Users",
        "description": "Users app",
    },
    {
        "name": "Auth",
        "description": "User authentication app",
    },
    {
        "name": "Birthmarks",
        "description": "Birthmarks app",
    },
    {
        "name": "Home",
        "desctiption": "Welcome page",
    },
]

app = FastAPI(openapi_tags=openapi_tags)

app.add_middleware(

    CORSMiddleware,
    allow_origins=["http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(user_router, prefix='/api', tags=["Users"])
app.include_router(auth_router, prefix='/api', tags=["Auth"])
app.include_router(birthmark_router, prefix='/api', tags=["Birthmarks"])

@app.get("/")
def root():
    return "Welcome"

