import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Student Management System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/student_db"
    )

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "8f6e5d3c0a2e7b4d6f9a8c1e5b7d3a1c2f4e6d8b9c0a1e2d3f4b5c6d7e8f9a0")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

    # CORS
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost,http://localhost:80,http://127.0.0.1"
    ).split(",")

settings = Settings()
