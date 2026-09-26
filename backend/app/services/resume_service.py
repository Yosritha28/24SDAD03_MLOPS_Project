from fastapi import UploadFile, HTTPException

from pypdf import PdfReader
from docx import Document

from io import BytesIO
import re

from app.services.ai_service import generate_recommendations


# Common technical skills we can detect
SKILLS = [
    "python",
    "java",
    "javascript",
    "react",
    "react.js",
    "html",
    "css",
    "node.js",
    "fastapi",
    "django",
    "flask",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "git",
    "github",
    "rest api",
    "rest apis",
    "machine learning",
    "deep learning",
    "pandas",
    "numpy",
    "matplotlib",
    "seaborn",
    "streamlit",
    "docker",
    "aws",
    "azure",
    "c++",
    "c",
    "data structures",
    "algorithms",
]


async def extract_resume_text(resume_file: UploadFile) -> str:

    filename = resume_file.filename.lower()

    file_content = await resume_file.read()

    if filename.endswith(".pdf"):

        reader = PdfReader(BytesIO(file_content))

        text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text.strip()

    elif filename.endswith(".docx"):

        document = Document(BytesIO(file_content))

        text = "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
        )

        return text.strip()

    else:

        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )


def extract_skills(text: str) -> list:

    text_lower = text.lower()

    found_skills = []

    for skill in SKILLS:

        pattern = r"\b" + re.escape(skill.lower()) + r"\b"

        if re.search(pattern, text_lower):
            found_skills.append(skill)

    return sorted(set(found_skills))


def extract_keywords(text: str) -> list:

    words = re.findall(
        r"\b[a-zA-Z][a-zA-Z0-9+#.-]{2,}\b",
        text.lower()
    )

    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "that",
        "this",
        "are",
        "you",
        "your",
        "from",
        "have",
        "has",
        "will",
        "our",
        "their",
        "they",
        "been",
        "into",
        "about",
        "using",
        "used",
        "work",
        "working",
        "years",
        "experience",
        "good",
        "strong",
        "knowledge",
        "skills",
        "role",
        "job",
        "candidate",
        "required",
        "requirements",
    }

    keywords = [
        word
        for word in words
        if word not in stop_words
    ]

    return sorted(set(keywords))


def calculate_keyword_match(
    resume_text: str,
    job_description: str
):

    resume_keywords = set(
        extract_keywords(resume_text)
    )

    job_keywords = set(
        extract_keywords(job_description)
    )

    if not job_keywords:
        return 0, []

    matched_keywords = sorted(
        resume_keywords.intersection(job_keywords)
    )

    score = round(
        (len(matched_keywords) / len(job_keywords)) * 100
    )

    return score, matched_keywords


def calculate_experience_match(
    resume_text: str,
    job_description: str
):

    resume_lower = resume_text.lower()
    job_lower = job_description.lower()

    experience_patterns = [
        r"\b\d+\+?\s+years?\b",
        r"\b\d+\+?\s+year\b",
        r"\bexperience\b",
        r"\bexperienced\b",
    ]

    resume_has_experience = any(
        re.search(pattern, resume_lower)
        for pattern in experience_patterns
    )

    job_requires_experience = any(
        re.search(pattern, job_lower)
        for pattern in experience_patterns
    )

    if not job_requires_experience:
        return 100

    if resume_has_experience:
        return 100

    return 50


def detect_sections(resume_text: str):

    text_lower = resume_text.lower()

    sections = {
        "summary": False,
        "skills": False,
        "education": False,
        "experience": False,
        "projects": False,
        "certifications": False,
    }

    section_keywords = {

        "summary": [
            "summary",
            "profile",
            "objective",
        ],

        "skills": [
            "skills",
            "technical skills",
        ],

        "education": [
            "education",
            "academic",
        ],

        "experience": [
            "experience",
            "work experience",
            "professional experience",
        ],

        "projects": [
            "projects",
            "project experience",
        ],

        "certifications": [
            "certifications",
            "certificates",
        ],
    }

    for section, keywords in section_keywords.items():

        for keyword in keywords:

            if keyword in text_lower:

                sections[section] = True

                break

    return sections


def generate_strengths(
    matched_skills: list,
    sections: dict,
    keyword_score: int
):

    strengths = []

    if matched_skills:

        strengths.append(
            f"Good match in technical skills: "
            f"{', '.join(matched_skills)}"
        )

    if sections["experience"]:

        strengths.append(
            "Work experience section detected."
        )

    if sections["projects"]:

        strengths.append(
            "Projects section detected."
        )

    if sections["education"]:

        strengths.append(
            "Education section detected."
        )

    if keyword_score >= 60:

        strengths.append(
            "Good keyword alignment with the job description."
        )

    return strengths


def calculate_overall_score(
    skill_score: int,
    keyword_score: int,
    experience_score: int
):

    overall_score = round(
        (skill_score * 0.50)
        + (keyword_score * 0.30)
        + (experience_score * 0.20)
    )

    return overall_score


async def analyze_resume(
    resume_file: UploadFile,
    job_description: str
):

    # --------------------------------
    # Extract resume text
    # --------------------------------

    resume_text = await extract_resume_text(
        resume_file
    )

    if not resume_text:

        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the resume."
        )

    # --------------------------------
    # Skill analysis
    # --------------------------------

    resume_skills = extract_skills(
        resume_text
    )

    job_skills = extract_skills(
        job_description
    )

    if job_skills:

        matched_skills = [
            skill
            for skill in job_skills
            if skill in resume_skills
        ]

        missing_skills = [
            skill
            for skill in job_skills
            if skill not in resume_skills
        ]

        skill_score = round(
            (len(matched_skills) / len(job_skills))
            * 100
        )

    else:

        matched_skills = []

        missing_skills = []

        skill_score = 0

    # --------------------------------
    # Keyword analysis
    # --------------------------------

    keyword_score, matched_keywords = (
        calculate_keyword_match(
            resume_text,
            job_description
        )
    )

    # --------------------------------
    # Experience analysis
    # --------------------------------

    experience_score = (
        calculate_experience_match(
            resume_text,
            job_description
        )
    )

    # --------------------------------
    # Resume sections
    # --------------------------------

    sections = detect_sections(
        resume_text
    )

    # --------------------------------
    # Overall score
    # --------------------------------

    overall_score = calculate_overall_score(
        skill_score,
        keyword_score,
        experience_score
    )

    # --------------------------------
    # Strengths
    # --------------------------------

    strengths = generate_strengths(
        matched_skills,
        sections,
        keyword_score
    )

    # --------------------------------
    # Gemini AI Recommendations
    # --------------------------------

    try:

        recommendations = generate_recommendations(
            resume_text,
            job_description,
            matched_skills,
            missing_skills
        )

    except Exception as error:

        print(
            "Gemini recommendation error:",
            error
        )

        recommendations = [
            "AI recommendations are temporarily unavailable."
        ]

    # --------------------------------
    # Final response
    # --------------------------------

    return {

        "filename": resume_file.filename,

        "message": "Resume analyzed successfully",

        "resume_text": resume_text,

        "job_description": job_description,

        "analysis": {

            "score": overall_score,

            "skills": matched_skills,

            "strengths": strengths,

            "missing_skills": missing_skills,

            "advanced_analysis": {

                "skill_match_score": skill_score,

                "keyword_match_score": keyword_score,

                "experience_match_score": experience_score,

                "matched_keywords": matched_keywords,

                "resume_sections": sections,
            },

            "recommendations": recommendations,
        }
    }