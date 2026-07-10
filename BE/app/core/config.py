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
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-me-in-production-use-openssl-rand-hex-32")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

    # API Key — dùng cho script/Postman/tool nội bộ, thay thế JWT
    # Nếu không set trong .env → None → tính năng bị tắt hoàn toàn (an toàn mặc định)
    # Tạo bằng: openssl rand -hex 32
    API_SECRET_KEY: str = os.getenv("API_SECRET_KEY", None)

    # CORS
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost,http://localhost:80,http://127.0.0.1,http://127.0.0.1:8080,http://localhost:8080"
    ).split(",")

settings = Settings()
