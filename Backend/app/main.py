from fastapi import FastAPI
from base.database import engine
import users.models
import users.models.user
from users.router.user_router import user_router
from auth.router.auth_router import auth_router
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

users.models.user.Base.metadata.create_all(bind=engine)

app.include_router(user_router, prefix='/api', tags=["Users"])
app.include_router(auth_router, prefix='/api', tags=["Auth"])


@app.get("/")
def root():
    return "Welcome"

