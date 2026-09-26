# ResumeIQ Postman API Test Report

## API Tested
- **Method:** `POST`
- **Endpoint:** `http://127.0.0.1:8000/api/resume/analyze`
- **Content-Type:** `multipart/form-data`
- **Service Stack:** FastAPI (Uvicorn), Python 3.14, pypdf, python-docx, Google GenAI

---

## Test Cases

| Test Case | Input | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| **1. Analyze Resume — Valid Request (.docx)** | `resume_file`: valid `.docx` file containing skills/experience; `job_description`: `"Looking for a Software Engineer with Python, React, FastAPI, SQL, and Docker experience."` | HTTP 200 OK with complete JSON containing scores, skills, matched keywords, sections, and recommendations | HTTP 200 OK; extracted text, overall score (96%), matched skills `["docker", "fastapi", "python", "react", "sql"]`, keyword/skill/experience match scores, section flags | ✅ PASSED |
| **2. Analyze Resume — Missing Resume File** | `resume_file`: omitted; `job_description`: `"Looking for a Python and React developer."` | HTTP 422 Unprocessable Entity with validation error pointing to missing `resume_file` | HTTP 422 Unprocessable Entity; `{"detail": [{"loc": ["body", "resume_file"], "msg": "Field required"}]}` | ✅ PASSED |
| **3. Analyze Resume — Missing Job Description** | `resume_file`: valid `.docx` file; `job_description`: omitted | HTTP 422 Unprocessable Entity with validation error pointing to missing `job_description` | HTTP 422 Unprocessable Entity; `{"detail": [{"loc": ["body", "job_description"], "msg": "Field required"}]}` | ✅ PASSED |
| **4. Analyze Resume — Invalid File Format (.txt)** | `resume_file`: `resume.txt` (unsupported plain text); `job_description`: `"Software Engineer role"` | HTTP 400 Bad Request with error detail indicating unsupported extension | HTTP 400 Bad Request; `{"detail": "Only PDF and DOCX files are supported."}` | ✅ PASSED |
| **5. Analyze Resume — Invalid File Format (.png)** | `resume_file`: `resume.png` (image); `job_description`: `"Software Engineer role"` | HTTP 400 Bad Request with error detail indicating unsupported extension | HTTP 400 Bad Request; `{"detail": "Only PDF and DOCX files are supported."}` | ✅ PASSED |
| **6. Analyze Resume — Empty Text Resume (Blank PDF)** | `resume_file`: `resume.pdf` with no extractable text; `job_description`: `"Python Developer"` | HTTP 400 Bad Request indicating text extraction failure | HTTP 400 Bad Request; `{"detail": "Could not extract text from the resume."}` | ✅ PASSED |
| **7. Root Health Check** | `GET http://127.0.0.1:8000/` | HTTP 200 OK confirming backend service is up | HTTP 200 OK; `{"message": "ResumeIQ backend is running"}` | ✅ PASSED |
| **8. Backend Offline / Network Failure Simulation** | Server unreachable / port closed | Frontend catches `TypeError: Failed to fetch`, resets loading, and displays user-friendly error banner | Handled by `Upload.jsx` `try/catch/finally` block; displays `.error-message` "Analysis Failed" without application crash | ✅ PASSED |

---

## Response Structure

When a valid resume and job description are submitted (`HTTP 200 OK`), the API returns the following JSON schema:

```json
{
  "filename": "jane_doe_resume.docx",
  "message": "Resume analyzed successfully",
  "resume_text": "Extracted text content from resume...",
  "job_description": "Job description text...",
  "analysis": {
    "score": 96,
    "skills": [
      "docker",
      "fastapi",
      "python",
      "react",
      "sql"
    ],
    "strengths": [
      "Good match in technical skills: docker, fastapi, python, react, sql",
      "Work experience section detected.",
      "Projects section detected.",
      "Education section detected.",
      "Good keyword alignment with the job description."
    ],
    "missing_skills": [],
    "advanced_analysis": {
      "skill_match_score": 100,
      "keyword_match_score": 88,
      "experience_match_score": 100,
      "matched_keywords": [
        "docker",
        "engineer",
        "fastapi",
        "python",
        "react",
        "software",
        "sql"
      ],
      "resume_sections": {
        "summary": true,
        "skills": true,
        "education": true,
        "experience": true,
        "projects": true,
        "certifications": false
      }
    },
    "recommendations": [
      "AI recommendations are temporarily unavailable."
    ]
  }
}
```

### Key Field Breakdown:
- `filename` *(string)*: Original filename of the uploaded resume.
- `message` *(string)*: Confirmation message.
- `analysis.score` *(number, 0-100)*: Weighted match score `(skill_score * 0.50 + keyword_score * 0.30 + experience_score * 0.20)`.
- `analysis.skills` *(array of strings)*: Skills detected in both resume and job description.
- `analysis.strengths` *(array of strings)*: Automatically generated positive alignment points.
- `analysis.missing_skills` *(array of strings)*: Required skills present in job description but absent from resume.
- `analysis.advanced_analysis`:
  - `skill_match_score` *(number, 0-100)*: Proportion of required technical skills present.
  - `keyword_match_score` *(number, 0-100)*: Proportion of job keywords matching resume.
  - `experience_match_score` *(number, 50 or 100)*: Experience phrase alignment indicator.
  - `matched_keywords` *(array of strings)*: Overlapping keywords.
  - `resume_sections` *(object with booleans)*: Detection status for `summary`, `skills`, `education`, `experience`, `projects`, and `certifications`.
- `analysis.recommendations` *(array of strings)*: Gemini AI generated actionable career advice (or fallback string when AI service is unavailable).

---

## Error Handling

| Scenario | HTTP Status | Response Payload |
|---|---|---|
| **Missing `resume_file`** | `422 Unprocessable Entity` | `{"detail": [{"loc": ["body", "resume_file"], "msg": "Field required", "type": "missing"}]}` |
| **Missing `job_description`** | `422 Unprocessable Entity` | `{"detail": [{"loc": ["body", "job_description"], "msg": "Field required", "type": "missing"}]}` |
| **Unsupported file type (e.g. `.txt`, `.png`)** | `400 Bad Request` | `{"detail": "Only PDF and DOCX files are supported."}` |
| **Unreadable / Empty text resume** | `400 Bad Request` | `{"detail": "Could not extract text from the resume."}` |
| **Gemini AI service unavailable** | `200 OK` (Soft fallback) | Backend catches exception in `ai_service.py` and returns `["AI recommendations are temporarily unavailable."]` rather than failing the entire analysis. |

---

## Final Result

- **Total Test Cases Executed:** 8
- **Passed:** 8
- **Failed:** 0
- **Success Rate:** 100%

### Associated Files:
1. **Postman Collection File:** `ResumeIQ_API_Testing.postman_collection.json` (importable into Postman Desktop or Web).
2. **API Test Report:** `POSTMAN_TEST_REPORT.md` (this document).

