from core.config import Settings
from dotenv import load_dotenv
import os

load_dotenv()

print(os.getenv('MYSQL_USERNAME'))

settings = Settings(
	ENVIRONMENT="local",
	JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", ""),
	MYSQL_USERNAME=os.getenv("MYSQL_USERNAME", ""),
	MYSQL_PASSWORD=os.getenv("MYSQL_PASSWORD", ""),
	MYSQL_SERVER=os.getenv("MYSQL_SERVER", ""),
	MYSQL_PORT=int(os.getenv("MYSQL_PORT", 0)),
	MYSQL_DATABASE=os.getenv("MYSQL_DATABASE", "")
)