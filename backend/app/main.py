from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

import os
import uuid
from pypdf import PdfReader

from .database import SessionLocal, engine, Base
from . import models, schemas


# =========================================================
# DATABASE
# =========================================================

# Create database tables
Base.metadata.create_all(bind=engine)


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="ResumeIQ Backend",
    version="0.1.0"
)


# =========================================================
# UPLOAD CONFIGURATION
# =========================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================================================
# DATABASE DEPENDENCY
# =========================================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "ResumeIQ Backend is running"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# =========================================================
# USERS
# =========================================================

# Get all users
@app.get("/users")
def get_users(db: Session = Depends(get_db)):

    users = db.query(models.User).all()

    return users


# Create user
@app.post(
    "/users",
    response_model=schemas.UserResponse
)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    # Check duplicate email
    existing_user = (
        db.query(models.User)
        .filter(models.User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=user.password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# Get user by ID
@app.get(
    "/users/{user_id}",
    response_model=schemas.UserResponse
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# Update user
@app.put(
    "/users/{user_id}",
    response_model=schemas.UserResponse
)
def update_user(
    user_id: int,
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check duplicate email
    existing_email = (
        db.query(models.User)
        .filter(
            models.User.email == user_data.email,
            models.User.id != user_id
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user.name = user_data.name
    user.email = user_data.email
    user.password = user_data.password
    user.role = user_data.role

    db.commit()
    db.refresh(user)

    return user


# Delete user
@app.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }


# =========================================================
# RESUMES
# =========================================================

# Get all resumes
@app.get("/resumes")
def get_resumes(db: Session = Depends(get_db)):

    resumes = db.query(models.Resume).all()

    return resumes


# =========================================================
# CREATE RESUME USING TEXT
# =========================================================

@app.post(
    "/resumes",
    response_model=schemas.ResumeResponse
)
def create_resume(
    resume: schemas.ResumeCreate,
    db: Session = Depends(get_db)
):

    # Check user exists when creating resume
    user = (
        db.query(models.User)
        .filter(models.User.id == resume.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    new_resume = models.Resume(
        user_id=resume.user_id,
        filename=resume.filename,
        resume_text=resume.resume_text
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return new_resume


# =========================================================
# UPLOAD RESUME PDF
# =========================================================

@app.post("/resumes/upload")
async def upload_resume(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Check whether user exists
    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Create uploads folder if it doesn't exist
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    # Save uploaded PDF
    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Extract text from PDF
    resume_text = ""

    try:
        reader = PdfReader(file_path)

        for page in reader.pages:
            text = page.extract_text()

            if text:
                resume_text += text + "\n"

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not extract PDF text: {str(e)}"
        )

    # Save resume information in database
    new_resume = models.Resume(
        user_id=user_id,
        filename=file.filename,
        resume_text=resume_text
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {
        "message": "Resume uploaded successfully",
        "resume_id": new_resume.id,
        "user_id": user_id,
        "filename": file.filename,
        "saved_file": file_path,
        "resume_text": resume_text
    }


# =========================================================
# JOBS
# =========================================================

# Get all jobs
@app.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):

    jobs = db.query(models.Job).all()

    return jobs


# Create job
@app.post(
    "/jobs",
    response_model=schemas.JobResponse
)
def create_job(
    job: schemas.JobCreate,
    db: Session = Depends(get_db)
):

    # Check recruiter exists
    recruiter = (
        db.query(models.User)
        .filter(models.User.id == job.recruiter_id)
        .first()
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail="Recruiter not found"
        )

    new_job = models.Job(
        recruiter_id=job.recruiter_id,
        title=job.title,
        description=job.description,
        required_skills=job.required_skills
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


# Get job by ID
@app.get(
    "/jobs/{job_id}",
    response_model=schemas.JobResponse
)
def get_job(
    job_id: int,
    db: Session = Depends(get_db)
):

    job = (
        db.query(models.Job)
        .filter(models.Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


# Update job
@app.put(
    "/jobs/{job_id}",
    response_model=schemas.JobResponse
)
def update_job(
    job_id: int,
    job_data: schemas.JobCreate,
    db: Session = Depends(get_db)
):

    job = (
        db.query(models.Job)
        .filter(models.Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Check recruiter exists
    recruiter = (
        db.query(models.User)
        .filter(models.User.id == job_data.recruiter_id)
        .first()
    )

    if not recruiter:
        raise HTTPException(
            status_code=404,
            detail="Recruiter not found"
        )

    job.recruiter_id = job_data.recruiter_id
    job.title = job_data.title
    job.description = job_data.description
    job.required_skills = job_data.required_skills

    db.commit()
    db.refresh(job)

    return job


# Delete job
@app.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db)
):

    job = (
        db.query(models.Job)
        .filter(models.Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login(
    data: schemas.LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(models.User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if user.password != data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }
# ============================================================
# RESUME ANALYSIS
# ============================================================

@app.get("/resumes/{resume_id}/analyze")
def analyze_resume(
    resume_id: int,
    db: Session = Depends(get_db)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    text = resume.resume_text or ""

    text_lower = text.lower()

    skills = []

    skill_list = [
        "python",
        "java",
        "c",
        "c++",
        "sql",
        "machine learning",
        "deep learning",
        "data science",
        "fastapi",
        "django",
        "flask",
        "react",
        "javascript",
        "html",
        "css",
        "aws",
        "azure",
        "git",
        "github"
    ]

    for skill in skill_list:
        if skill in text_lower:
            skills.append(skill)

    return {
        "resume_id": resume.id,
        "user_id": resume.user_id,
        "filename": resume.filename,
        "skills_found": skills,
        "text_length": len(text),
        "message": "Resume analyzed successfully"
    }
# ============================================================
# JOB MATCHING
# ============================================================

@app.get("/resumes/{resume_id}/match/{job_id}")
def match_resume_with_job(
    resume_id: int,
    job_id: int,
    db: Session = Depends(get_db)
):
    # Get resume
    resume = (
        db.query(models.Resume)
        .filter(models.Resume.id == resume_id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    # Get job
    job = (
        db.query(models.Job)
        .filter(models.Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Resume text
    resume_text = (resume.resume_text or "").lower()

    # Required skills from job
    required_skills_text = job.required_skills or ""

    # Convert required skills into a list
    required_skills = [
        skill.strip().lower()
        for skill in required_skills_text.split(",")
        if skill.strip()
    ]

    # Find matching skills
    matched_skills = []
    missing_skills = []

    for skill in required_skills:
        if skill in resume_text:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    # Calculate match percentage
    if len(required_skills) > 0:
        match_percentage = (
            len(matched_skills) / len(required_skills)
        ) * 100
    else:
        match_percentage = 0

    return {
        "resume_id": resume.id,
        "job_id": job.id,
        "job_title": job.title,
        "required_skills": required_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_percentage": round(match_percentage, 2),
        "message": "Resume matched with job successfully"
    }