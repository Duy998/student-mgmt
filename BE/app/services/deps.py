from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from sqlalchemy.orm import Session
from typing import Optional
from ..core import decode_access_token, get_db
from ..core.config import settings
from ..models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)




def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username: str = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is disabled")
    return current_user


def get_admin_user(current_user: User = Depends(get_active_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user


# ── New Dependency: Accept API Key OR JWT ───────────────────────────────
#
# Verification flow:
#   1. Is there an X-API-Key header?
#      → Matches settings.API_SECRET_KEY? → Return a fake admin user (sentinel)
#      → Does not match?                 → Return 401 immediately, do not try JWT
#   2. No X-API-Key → Try normal JWT authentication
#      → Valid JWT? → Return the real user from DB
#      → Invalid?   → Return 401
#
# Why return a "fake admin user" instead of a real user when using API Key?
#   Because the API Key is a credential for tools/scripts and is not associated
#   with any specific user in the database.
#   Creating a temporary User object with is_admin=True is enough for routers
#   to perform permission checks without querying the DB or creating a real user.

def _make_api_key_user() -> User:
    """Create a sentinel user representing the API Key caller (admin-level, not stored in DB)."""
    u = User()
    u.id = -1                      
    u.username = "__api_key__"
    u.full_name = "API Key Client"
    u.is_active = True
    u.is_admin = True              
    u.hashed_password = ""
    return u


def get_active_user_or_apikey(
    api_key: Optional[str] = Security(api_key_header),
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Used instead of get_active_user in endpoints that accept both API Key and JWT.
    Prioritizes checking the API Key first, then falls back to JWT.
    """

    if api_key is not None:
        if not settings.API_SECRET_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="API Key authentication is disabled on this server. Set API_SECRET_KEY in .env to enable.",
            )
        if api_key != settings.API_SECRET_KEY:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API Key",
                headers={"WWW-Authenticate": "X-API-Key"},
            )
        return _make_api_key_user()


    if token:
        payload = decode_access_token(token)
        if payload:
            username = payload.get("sub")
            user = db.query(User).filter(User.username == username).first()
            if user and user.is_active:
                return user


    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated. Provide 'Authorization: Bearer <token>' or 'X-API-Key: <key>'.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_admin_user_or_apikey(
    current_user: User = Depends(get_active_user_or_apikey),
) -> User:
    """
    Used instead of get_admin_user in admin-only endpoints.
    The API Key already has admin-level access, so no additional check is required.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
