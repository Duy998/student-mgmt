import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core import settings, Base, engine, hash_password, get_db
from .routers import auth, students, users, quiz
from .models import User

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(students.router, prefix=settings.API_PREFIX)
app.include_router(users.router, prefix=settings.API_PREFIX)
app.include_router(quiz.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    _seed_admin()


def _seed_admin():
    """Create a default admin account on first run if none exists."""
    from .core.database import SessionLocal
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.is_admin == True).first():  # noqa: E712
            admin = User(
                username="admin",
                email="admin@school.local",
                full_name="Quản trị viên",
                hashed_password=hash_password("Admin@123"),
                is_admin=True,
                is_active=True,
            )
            db.add(admin)
            db.commit()
            logger.info("Seeded default admin account: admin / Admin@123 — change this password immediately.")
    finally:
        db.close()


@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": settings.PROJECT_NAME, "version": settings.VERSION}
