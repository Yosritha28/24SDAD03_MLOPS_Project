import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = None

if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as exc:  # pragma: no cover - runtime environment protection
        print(f"Gemini client initialization failed: {exc}")


def generate_recommendations(
    resume_text: str,
    job_description: str,
    matched_skills: list,
    missing_skills: list,
):
    if not client:
        return ["AI recommendations are temporarily unavailable."]

    prompt = f"""
You are an expert resume and career advisor.

Analyze the candidate's resume against the job description.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

MATCHED SKILLS:
{", ".join(matched_skills) if matched_skills else "None"}

MISSING SKILLS:
{", ".join(missing_skills) if missing_skills else "None"}

Provide 5 concise and practical recommendations.

Focus on:
1. Missing skills the candidate should consider learning.
2. Resume improvements.
3. Keywords that should be emphasized.
4. Experience or project improvements.
5. Overall advice to improve job compatibility.

Return ONLY the recommendations as a numbered list.
Do not include an introduction or conclusion.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        recommendations = []

        for line in text.splitlines():
            line = line.strip()

            if not line:
                continue

            cleaned = line.lstrip("0123456789").lstrip(".").lstrip(")").strip()

            if cleaned:
                recommendations.append(cleaned)

        return recommendations[:5]
    except Exception as exc:  # pragma: no cover - runtime environment protection
        print(f"Gemini recommendation generation failed: {exc}")
        return ["AI recommendations are temporarily unavailable."]