# ResumeIQ — Comprehensive Project Documentation

**Project Title**: ResumeIQ — AI-Powered Resume Screening & Career Intelligence Platform  
**Authors / Team**: ResumeIQ Project Team (Member 4: Frontend & Mobile Integration)  
**Date**: October 2026  
**Repository**: [github.com/dhathri746/ResumeIQ-Frontend](https://github.com/dhathri746/ResumeIQ-Frontend)  
**Group Branch**: `feature/member4/frontend` at `github.com/Yosritha28/24SDAD03_MLOPS_Project`  

---

## 1. Project Title
**ResumeIQ: End-to-End AI-Driven Resume Screening, Compatibility Scoring, and Career Intelligence System (Web & Mobile)**

---

## 2. Problem Statement
In today's modern job market, hiring workflows face severe bottlenecks:
1. **Inefficient Candidate Screening**: Recruiters receive hundreds of resumes for a single opening, spending an average of 6–10 seconds manually scanning each document.
2. **Lack of Transparent Feedback for Job Seekers**: Candidates rarely understand why their resumes were filtered out or what specific keywords and technical skills were missing.
3. **Inconsistent Scoring**: Manual screening introduces human subjectivity and cognitive fatigue into the candidate evaluation process.
4. **Desktop-Only Limitations**: Most applicant tracking systems lack responsive or dedicated mobile tools for candidates on the go.

---

## 3. Project Objectives
- Build an automated, objective, and transparent resume evaluation pipeline.
- Extract textual content from `.pdf` and `.docx` resumes using standard NLP/document parsers.
- Compute multi-dimensional compatibility scores comparing resumes to job descriptions:
  - Overall Compatibility Score
  - Skill Match Score
  - Keyword Alignment Score
  - Experience Alignment Score
- Detect matched technical competencies and identify missing skill gaps.
- Leverage LLM heuristics (Google Gemini API) to generate actionable candidate improvements.
- Provide a dual-access ecosystem:
  1. A responsive **React 19 + Vite web application** with Candidate, Recruiter, and Admin portals.
  2. A dedicated **React Native + Expo mobile application** connecting to the **same** backend.

---

## 4. Proposed Solution
ResumeIQ provides a unified client-server architecture:
- **FastAPI Backend (`backend/app`)**: Exposes REST endpoints for document ingestion and text extraction (`pypdf`, `python-docx`), regex-driven domain skill extraction (36+ technical competencies), stopword-filtered keyword matching, ATS section detection, and Gemini-based career recommendations.
- **Web Frontend (`src/`)**: A dark-themed career intelligence dashboard built in React + Vite, featuring candidate uploads, real-time Recharts score visualizations, printable full audit reports, recruiter evaluation dashboards with comparison modals, and local application persistence.
- **Mobile Frontend (`mobile/`)**: A cross-platform React Native app (Expo SDK 52) delivering on-device resume selection, customizable backend IP configuration, and instant scoring over the shared FastAPI API contract.

---

## 5. System Overview
```
+---------------------------------------------------------------------------------+
|                                 CLIENT CLIENTS                                  |
|                                                                                 |
|   +------------------------------------+   +--------------------------------+   |
|   |         Web Frontend (React)       |   |       Mobile App (Expo)        |   |
|   |  - Home / Landing                  |   |  - Welcome Screen              |   |
|   |  - Upload & Job Input              |   |  - Home & Quick Scan           |   |
|   |  - Analysis Visualizations         |   |  - DocumentPicker (PDF/DOCX)   |   |
|   |  - Full Report & PDF Print         |   |  - Results & Skills Breakout   |   |
|   |  - Recruiter Portal & Comparison   |   |  - Full Report & Share         |   |
|   |  - Admin Telemetry                 |   |  - Applications Pipeline       |   |
|   |  - Applications Tracking           |   |  - Profile & LAN IP Settings   |   |
|   +-----------------+------------------+   +---------------+----------------+   |
+---------------------|--------------------------------------|--------------------+
                      |                                      |
                      |  multipart/form-data                 |  multipart/form-data
                      |  (resume_file, job_description)      |  (resume_file, job_description)
                      v                                      v
+---------------------------------------------------------------------------------+
|                           FASTAPI BACKEND SERVICE                               |
|                        (http://<HOST>:8000/api/resume)                          |
|                                                                                 |
|   +-------------------------------------------------------------------------+   |
|   |                         Routing & Request Handler                       |   |
|   |  - POST /api/resume/analyze                                             |   |
|   |  - GET  / (Healthcheck)                                                 |   |
|   +------------------------------------+------------------------------------+   |
|                                        |                                        |
|   +------------------------------------v------------------------------------+   |
|   |                         Document Text Extraction                        |   |
|   |  - pypdf (PdfReader)  |  python-docx (Document)                         |   |
|   +------------------------------------+------------------------------------+   |
|                                        |                                        |
|   +------------------------------------v------------------------------------+   |
|   |                     Scoring & Heuristic Algorithms                      |   |
|   |  - Regex Technical Skill Matcher (SKILLS dictionary)                    |   |
|   |  - Alphanumeric Tokenizer & Stopword Filtering                          |   |
|   |  - ATS Resume Section Detector (Experience, Education, Skills, etc.)    |   |
|   |  - Weighted Multi-Factor Score Calculator                               |   |
|   +------------------------------------+------------------------------------+   |
|                                        |                                        |
|   +------------------------------------v------------------------------------+   |
|   |                        AI Recommendation Engine                         |   |
|   |  - Google GenAI SDK (gemini-2.5-flash) with Graceful Fallback           |   |
|   +-------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------+
```

---

## 6. System Architecture
The system follows a decoupled 3-tier architecture:
1. **Presentation Layer**: Dual frontends (Web via Vite + React; Mobile via React Native + Expo).
2. **API & Orchestration Layer**: FastAPI asynchronously parsing multipart payloads, validating file constraints, and coordinating algorithmic scoring.
3. **Intelligence & NLP Layer**: Local regex tokenizers, section heuristics, and Google Gemini 2.5 Flash for contextual career advisories.

---

## 7. Web Application Architecture
- **Framework**: React 18 / 19 + Vite.
- **Routing**: `react-router-dom` (BrowserRouter with `/`, `/upload`, `/recruiter`, `/report`, `/admin`, `/applications`).
- **Data Flow**: Reactive component state; analysis payloads pass to `/report` via React Router `location.state`.
- **Reusable Component System (`src/components/`)**:
  - `Button.jsx`, `Card.jsx`, `StatusBadge.jsx`, `Modal.jsx`, `LoadingState.jsx`, `EmptyState.jsx`, `ErrorState.jsx`.
- **Styling**: Pure scoped CSS (`src/App.css`, `src/index.css`) utilizing dark theme CSS variables:
  - `--riq-bg: #08090D`, `--riq-surface: #10121A`, `--riq-surface-2: #151824`, `--riq-accent: #6C63FF`, `--riq-accent-2: #38BDF8`.

---

## 8. Mobile Application Architecture
- **Location**: Isolated subproject directory `mobile/`.
- **Framework**: React Native `0.76.9` + Expo `52.0.49`.
- **Navigation (`mobile/navigation/`)**:
  - `RootNavigator.jsx`: Native Stack Navigator (`Welcome` -> `MainTabs` -> `Result` -> `Report`).
  - `TabNavigator.jsx`: Bottom Tab Navigator (`Home`, `Scanner`, `Pipeline`, `Settings`).
- **Document Picker**: `expo-document-picker` supporting `.pdf`, `.docx`, and `.doc`.
- **Networking (`mobile/services/api.js`)**:
  - Standard React Native `FormData` containing `{ uri, name, type }` without manual `Content-Type` overrides.
  - Configurable `API_BASE_URL` with dynamic LAN IP detection (`mobile/config/api.js`) and in-app settings override.
- **Persistence (`mobile/services/storage.js`)**: `@react-native-async-storage/async-storage` preserving submitted applications and recent scans offline.

---

## 9. Backend Architecture
- **Framework**: FastAPI (Python 3.10+ / 3.14).
- **Core Entry Point**: `backend/app/main.py`.
- **Endpoints**:
  - `GET /`: Healthcheck probe returning `{"message": "ResumeIQ backend is running"}`.
  - `POST /api/resume/analyze`: Multipart upload taking `resume_file` (UploadFile) and `job_description` (str).
- **Services (`backend/app/services/`)**:
  - `resume_service.py`: Parsing `.pdf` (via `pypdf`) and `.docx` (via `docx.Document`), technical skill detection, ATS section checks, weighted score calculation.
  - `ai_service.py`: Integration with `google-genai` calling `gemini-2.5-flash` with graceful fallback when unconfigured.

---

## 10. AI/MLOps Workflow
1. **Document Ingestion**: Stream binary content from HTTP upload.
2. **Text Normalization**: Strip binary headers, normalize character sets, convert to lowercase.
3. **Keyword & Skill Tokenization**:
   - Match against 36+ curated technical domains (`python`, `fastapi`, `react`, `docker`, `aws`, `sql`, etc.).
   - Extract unique alphanumeric tokens, filter against standard English stop words (`and`, `the`, `with`, `for`, etc.).
4. **Section Presence Verification**: Regex search for standard resume headings: Summary, Skills, Experience, Education, Projects, Certifications.
5. **Weighted Scoring Model**:
   $$\text{Overall Score} = (\text{Skill Match} \times 0.50) + (\text{Keyword Match} \times 0.30) + (\text{Experience Match} \times 0.20)$$
6. **LLM Recommendation Advisory**:
   - Query Gemini 2.5 Flash with resume summary, matched skills, and identified gaps.
   - Parse top 5 structured recommendations.
   - If offline or missing key, fallback cleanly to `"AI recommendations are temporarily unavailable"`.

---

## 11. Resume Analysis Workflow
```
[User Selects Resume File] + [Pastes Job Description]
                      |
                      v
      Client Form Submission (POST multipart)
                      |
                      v
    FastAPI Ingestion & File Type Verification
                      |
        +-------------+-------------+
        |                           |
  (.pdf File)                 (.docx File)
        |                           |
  pypdf.PdfReader             docx.Document
        |                           |
        +-------------+-------------+
                      |
                      v
            Extracted Plain Text
                      |
         +------------+------------+
         |                         |
Skill Regex Matcher        Stopword Tokenizer
         |                         |
   Matched Skills          Matched Keywords
   Missing Skills                  |
         |                         |
         +------------+------------+
                      |
                      v
         ATS Section Verification
                      |
                      v
      Mathematical Score Synthesis
                      |
                      v
       Gemini 2.5 Flash Advisory
                      |
                      v
      Structured JSON Response (HTTP 200)
```

---

## 12. Technologies Used

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Web Frontend** | React 18/19, Vite, React Router 7 | Core web single-page application |
| | Recharts | Interactive SVG score and telemetry visualizations |
| | Scoped CSS | Dark-themed, responsive user interface |
| **Mobile Frontend** | React Native 0.76.9, Expo 52 | Cross-platform iOS & Android mobile application |
| | React Navigation (Stack & Tabs) | Screen transitions and bottom navigation bar |
| | Expo Document Picker | Native file browsing for PDF & Word documents |
| | AsyncStorage | Local offline mobile persistence |
| **Backend** | FastAPI, Uvicorn, Python | Asynchronous REST API service |
| | pypdf | PDF document text extraction |
| | python-docx | Word `.docx` document parsing |
| **AI / NLP** | Google GenAI SDK (`gemini-2.5-flash`) | Contextual career advice generation |
| | Python `re` (Regex) | Token matching & skill boundary extraction |

---

## 13. Web Features
1. **Candidate Upload & Workspace (`/upload`)**:
   - Drag-and-drop / file selector for PDF & DOCX.
   - Job description textarea with character counter.
   - Dynamic loading indicators and error banners.
2. **Analysis Dashboard**:
   - Prominent circular score card.
   - Skill Match, Keyword Match, Experience Match metric cards.
   - Green matched skill tags and amber missing skill gap tags.
   - ATS section checklist (Summary, Skills, Experience, Education).
   - AI recommendations list.
3. **Full Report View (`/report`)**:
   - Printable view (`window.print()` / PDF export).
   - Comprehensive audit breakdown passed via React Router state.
4. **Candidate Pipeline (`/applications`)**:
   - Persistent application list stored in browser `localStorage`.
   - Status filters (`All`, `Applied`, `Under Review`, `Shortlisted`, `Rejected`).
   - Detailed modal view with status tracker timeline.
5. **Recruiter Portal (`/recruiter`)**:
   - Candidate management with search and multi-criteria filters.
   - Side-by-side candidate comparison modal.
   - Candidate rating and recruiter notes saving.
6. **Admin Telemetry (`/admin`)**:
   - Dynamic probe against `GET /` to verify backend latency.
   - Overview charts for score distribution and request telemetry.

---

## 14. Mobile Features
1. **Welcome Screen**: Clean splash screen with branding and immediate entry CTA.
2. **Dashboard Screen**: Overview statistics, recent scan summary, and live FastAPI connection pill.
3. **Scanner Screen**: Document picker for PDF/DOCX, keyboard-avoiding job description input, loading state, and error handling.
4. **Results Screen**: Visual match percentages, matched vs missing skill pills, strengths, and recommendations.
5. **Report Screen**: Detailed audit matching the web report view with native system text sharing (`Share.share`).
6. **Pipeline Screen**: Offline-first application tracking with status pills and modal details.
7. **Profile & Settings Screen**:
   - Configurable Backend Base URL (allows setting Mac LAN IP for physical phones).
   - In-app **Test Connection** button validating live responses from `GET /`.

---

## 15. API Integration
- **Healthcheck**:
  - `GET /`
  - Response: `{"message": "ResumeIQ backend is running"}`
- **Analysis Endpoint**:
  - `POST /api/resume/analyze`
  - Headers: `Accept: application/json`
  - Body: `multipart/form-data` with:
    - `resume_file`: Binary file stream
    - `job_description`: Plain text string
  - Response Structure:
    ```json
    {
      "filename": "string",
      "message": "Resume analyzed successfully",
      "resume_text": "string",
      "job_description": "string",
      "analysis": {
        "score": 85,
        "skills": ["python", "react", "docker"],
        "missing_skills": ["aws"],
        "strengths": ["string"],
        "advanced_analysis": {
          "skill_match_score": 80,
          "keyword_match_score": 75,
          "experience_match_score": 100,
          "matched_keywords": ["python", "software", "developer"],
          "resume_sections": {
            "summary": true,
            "skills": true,
            "education": true,
            "experience": true,
            "projects": false,
            "certifications": false
          }
        },
        "recommendations": ["string"]
      }
    }
    ```

---

## 16. Database / Storage Approach
In accordance with actual project implementation:
- **No external relational database (e.g., PostgreSQL/MySQL) or cloud datastore is used**.
- **Web Storage**: `localStorage` using key `resumeiq_applications` stores candidate application history and initial mock seed data.
- **Mobile Storage**: `@react-native-async-storage/async-storage` using keys `resumeiq_mobile_applications`, `resumeiq_mobile_recent_analysis`, and `resumeiq_mobile_api_url`.

---

## 17. User (Candidate) Workflow
1. Navigate to `/upload` (web) or the **Scanner** tab (mobile).
2. Select a `.pdf` or `.docx` resume file.
3. Paste target job description.
4. Tap **Analyze Resume**.
5. Inspect overall score, matched skills, gaps, and recommendations.
6. Click **View Full Report** for the full ATS audit.
7. Track the submission in the **Applications** view.

---

## 18. Recruiter Workflow
1. Open the `/recruiter` portal on the web app.
2. Search candidates by name, role, or technical skill.
3. Filter by match percentage (e.g., `90+`, `80+`, `70+`) or status.
4. Select 2+ candidates and launch **Side-by-Side Comparison**.
5. Shortlist or Reject applicants with instant status updates.
6. Record internal candidate evaluation feedback and ratings.

---

## 19. Testing and Validation
- **Backend API Tests**: Verified with Python `requests` and Postman collection against `POST /api/resume/analyze` using real `.docx` documents.
- **Network Validation**: Backend started with `--host 0.0.0.0 --port 8000`. Verified accessible on both `127.0.0.1` and Mac LAN IP `10.124.2.11`.
- **Web Frontend Build**: Executed `npm run build` using Vite. 609 modules transformed, built in 244ms with zero errors.
- **Mobile Build**: Executed `npx expo export -p android`. 816 modules bundled successfully into production bytecode (`.hbc`) with zero errors.

---

## 20. Results
- **Accurate Scoring**: Successfully parses complex resumes, identifying exact matched skills (e.g. `python`, `fastapi`, `react`) and missing requirements (e.g. `aws`).
- **Zero Startup Crashes**: Lazy Gemini initialization ensures the backend runs smoothly even without active cloud API keys.
- **Unified Backend**: Both the React web application and React Native mobile application query the identical backend endpoint with 100% contract parity.

---

## 21. Member 4 Contribution (Frontend & Mobile Integration)
- **Web Application Refactoring & Reusable Component System**:
  - Implemented reusable components (`Button`, `Card`, `StatusBadge`, `Modal`, `LoadingState`, `EmptyState`, `ErrorState`).
  - Integrated components across `Applications.jsx`, `Recruiter.jsx`, and `Admin.jsx`.
- **Candidate Application Tracking Layer**:
  - Connected `/applications` route to `App.jsx`.
  - Built offline-safe persistence for candidate application records.
- **Complete React Native Mobile Application (`mobile/`)**:
  - Designed and built all 7 mobile screens (`Welcome`, `Home`, `Upload`, `Result`, `Report`, `Applications`, `Profile`).
  - Implemented mobile navigation stack and bottom tabs.
  - Built mobile `ApiService` for multipart file uploads with `expo-document-picker`.
  - Implemented dynamic LAN IP configuration in `ProfileScreen` for physical device testing.
- **Cross-Platform Parity & Production Verification**:
  - Maintained identical dark theme design language between web and mobile.
  - Successfully validated production exports for both web (`vite build`) and mobile (`expo export`).

---

## 22. GitHub Repositories
- **Personal Repository**: [https://github.com/dhathri746/ResumeIQ-Frontend](https://github.com/dhathri746/ResumeIQ-Frontend)  
  *(Main branch & feature/member4/frontend branch updated).*
- **Team Repository**: [https://github.com/Yosritha28/24SDAD03_MLOPS_Project](https://github.com/Yosritha28/24SDAD03_MLOPS_Project)  
  *(Branch: `feature/member4/frontend`).*

---

## 23. Limitations
- Resume text extraction relies on standard text layers; scanned image PDFs without OCR are not supported.
- Skill detection is currently limited to the curated dictionary of technical domains.
- Data persistence is client-side (`localStorage` / `AsyncStorage`); records do not sync across different browsers or devices without a centralized database.

---

## 24. Future Enhancements
- Integrate Tesseract OCR for scanned image-based PDF resumes.
- Implement a centralized PostgreSQL database with JWT authentication for candidates and recruiters.
- Expand LLM prompt engineering for role-specific interview question generation.
- Deploy backend to containerized cloud platforms (AWS ECS / Google Cloud Run) and frontend to Vercel.

---

## 25. Conclusion
ResumeIQ successfully demonstrates a modern, end-to-end AI career intelligence solution. By integrating a responsive React web portal, a lightweight React Native mobile app, and a robust FastAPI NLP backend, the system bridges the gap between candidates and recruiters with objective, automated, and instant resume evaluations.

