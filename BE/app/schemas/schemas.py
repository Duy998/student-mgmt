from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import date, datetime
from typing import Optional, List


# ── Auth ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=6)


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_active: bool
    is_admin: bool
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None


class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ── Student ───────────────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    student_code: str = Field(..., max_length=20)
    full_name: str = Field(..., max_length=100)
    date_of_birth: date
    gender: str = Field(..., max_length=10)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=15)
    address: Optional[str] = None
    class_name: Optional[str] = Field(None, max_length=50)
    gpa: Optional[float] = Field(0.0, ge=0.0, le=10.0)
    status: Optional[str] = "active"

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v):
        if v not in ["Male", "Female", "Other"]:
            raise ValueError("Gender must be Male, Female, or Other")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in ["active", "inactive", "graduated"]:
            raise ValueError("Status must be active, inactive, or graduated")
        return v


class StudentUpdate(BaseModel):
    student_code: Optional[str] = Field(None, max_length=20)
    full_name: Optional[str] = Field(None, max_length=100)
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, max_length=10)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=15)
    address: Optional[str] = None
    class_name: Optional[str] = Field(None, max_length=50)
    gpa: Optional[float] = Field(None, ge=0.0, le=10.0)
    status: Optional[str] = None


class StudentOut(StudentCreate):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ── Statistics ────────────────────────────────────────────────────────────────

class Statistics(BaseModel):
    total: int
    active: int
    inactive: int
    graduated: int
    average_gpa: float


# ── Question ──────────────────────────────────────────────────────────────────

class QuestionOut(BaseModel):
    id: int
    code: str
    grade: int
    topic: str
    level: str
    q_type: str
    content: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# Answer hidden from students — only used by admin views
class QuestionAdminOut(QuestionOut):
    answer: str


# ── Quiz ──────────────────────────────────────────────────────────────────────

class QuizSubmitItem(BaseModel):
    question_id: int
    chosen: str   # A / B / C / D


class QuizSubmitPayload(BaseModel):
    answers: List[QuizSubmitItem]
    time_spent: Optional[int] = None   # seconds


class QuizResult(BaseModel):
    score: float
    correct: int
    total: int
    time_spent: Optional[int] = None


class AttemptOut(BaseModel):
    id: int
    user_id: int
    username: str
    score: float
    total: int
    correct: int
    time_spent: Optional[int] = None
    submitted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
