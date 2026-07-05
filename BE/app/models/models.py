from sqlalchemy import Column, Integer, String, Float, Date, Boolean, Text, DateTime, Enum
from sqlalchemy.sql import func
import enum
from ..core.database import Base


class GenderEnum(str, enum.Enum):
    male = "Nam"
    female = "Nữ"
    other = "Khác"


class StatusEnum(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    graduated = "graduated"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), unique=True, index=True, nullable=False)   # e.g. L6-001
    grade = Column(Integer, nullable=False)                               # Khối
    topic = Column(String(100), nullable=False)                           # Chủ đề
    level = Column(String(50), nullable=False)                            # Mức độ
    q_type = Column(String(10), nullable=False, default="TN")             # Loại
    content = Column(Text, nullable=False)                                # Câu hỏi
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    answer = Column(String(1), nullable=False)                            # A/B/C/D
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    username = Column(String(50), nullable=False)
    score = Column(Float, nullable=False)         # % correct
    total = Column(Integer, nullable=False)       # total questions drawn
    correct = Column(Integer, nullable=False)     # correct count
    time_spent = Column(Integer, nullable=True)   # seconds
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_code = Column(String(20), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(10), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15), nullable=True)
    address = Column(Text, nullable=True)
    class_name = Column(String(50), nullable=True)
    gpa = Column(Float, default=0.0)
    status = Column(String(20), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
