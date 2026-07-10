from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from sqlalchemy.orm import Session
from typing import Optional
from ..core import decode_access_token, get_db
from ..core.config import settings
from ..models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

# Header schema cho API Key
# auto_error=False: FastAPI không tự raise 403 nếu header vắng mặt
# → để deps.py tự kiểm soát logic lỗi
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


# ── Dependency gốc: chỉ JWT ───────────────────────────────────────────────────

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


# ── Dependency mới: chấp nhận API Key HOẶC JWT ───────────────────────────────
#
# Luồng kiểm tra:
#   1. Có header X-API-Key?
#      → Khớp settings.API_SECRET_KEY? → trả về user admin giả (sentinel)
#      → Không khớp?                   → 401 ngay, không thử JWT
#   2. Không có X-API-Key → thử JWT bình thường
#      → JWT hợp lệ? → trả về user thật từ DB
#      → Không?      → 401
#
# Tại sao trả về "user admin giả" thay vì user thật khi dùng API Key?
#   Vì API Key là credential của tool/script, không gắn với user cụ thể trong DB.
#   Tạo một User object tạm thời với is_admin=True đủ để các router
#   kiểm tra quyền mà không cần query DB hay tạo user thật.

def _make_api_key_user() -> User:
    """Tạo user sentinel đại diện cho API Key caller (admin-level, không lưu DB)."""
    u = User()
    u.id = -1                      # ID âm để phân biệt với user thật
    u.username = "__api_key__"
    u.full_name = "API Key Client"
    u.is_active = True
    u.is_admin = True              # API Key luôn có quyền admin
    u.hashed_password = ""
    return u


def get_active_user_or_apikey(
    api_key: Optional[str] = Security(api_key_header),
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dùng thay cho get_active_user ở các endpoint muốn chấp nhận cả API Key.
    Ưu tiên kiểm tra API Key trước, sau đó mới JWT.
    """
    # Bước 1: kiểm tra API Key
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

    # Bước 2: thử JWT
    if token:
        payload = decode_access_token(token)
        if payload:
            username = payload.get("sub")
            user = db.query(User).filter(User.username == username).first()
            if user and user.is_active:
                return user

    # Bước 3: không có gì hợp lệ
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated. Provide 'Authorization: Bearer <token>' or 'X-API-Key: <key>'.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_admin_user_or_apikey(
    current_user: User = Depends(get_active_user_or_apikey),
) -> User:
    """
    Dùng thay cho get_admin_user ở các endpoint admin-only.
    API Key đã là admin-level nên không cần kiểm tra thêm.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
