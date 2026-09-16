from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app.services.resume_service import analyze_resume


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)


@router.post("/analyze")
async def analyze_resume_endpoint(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not resume_file.filename:
        raise HTTPException(
            status_code=400,
            detail="Resume file is required"
        )

    result = await analyze_resume(
        resume_file,
        job_description
    )

    return result