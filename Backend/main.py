from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from auth.routes.auth_router import auth_router
from user.routes.user_router import user_router

openapi_tags = [
    {
        "name": "Health",
        "description": "Application helath checks"
    },
    {
        "name": "Users",
        "description": "User operations",
    },
    {
        "name": "Authentication",
        "description": "User authentication"
    },
]

app = FastAPI(openapi_tags=openapi_tags)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

app.include_router(auth_router, prefix="/api", tags=['Auth'])
app.include_router(user_router, prefix="/api", tags=["Users"])

@app.get("/health", tags=["Health Checks"])
def read_root():
    return {"Health": "true"}