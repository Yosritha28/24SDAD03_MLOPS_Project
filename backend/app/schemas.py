from pydantic import BaseModel


# =========================
# USER SCHEMAS
# =========================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    password: str
    role: str

    class Config:
        from_attributes = True


# =========================
# RESUME SCHEMAS
# =========================

class ResumeCreate(BaseModel):
    user_id: int
    filename: str
    resume_text: str | None = None


class ResumeResponse(BaseModel):
    id: int
    user_id: int
    filename: str
    resume_text: str | None = None

    class Config:
        from_attributes = True


# =========================
# JOB SCHEMAS
# =========================

class JobCreate(BaseModel):
    recruiter_id: int
    title: str
    description: str
    required_skills: str | None = None


class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    description: str
    required_skills: str | None = None

    class Config:
        from_attributes = True
class LoginRequest(BaseModel):
    email: str
    password: str