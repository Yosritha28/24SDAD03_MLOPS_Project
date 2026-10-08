# ResumeIQ — Final Presentation & Live Demo Guide

**Project**: ResumeIQ — AI-Powered Resume Screening & Career Intelligence  
**Focus**: Dual-Platform System (React Web + React Native Mobile) powered by FastAPI  

---

## 📽️ 20-Slide Presentation Plan

### Slide 1: Title & Overview
- **Title**: ResumeIQ — AI-Powered Resume Screening & Career Intelligence
- **Bullet Points**:
  - Automated resume parsing and multi-metric job compatibility scoring.
  - Contextual AI recommendations via Google Gemini 2.5 Flash.
  - Unified system architecture serving both Web (React + Vite) and Mobile (React Native + Expo).
- **Screenshot / Demo Visual**: Hero banner showing ResumeIQ Web and Mobile app side-by-side.
- **Presenter Script**:
  > *"Good morning everyone. Today we are presenting ResumeIQ, an end-to-end AI career intelligence platform designed to eliminate resume screening bottlenecks for both job applicants and recruiting teams through automated parsing, skill gap analysis, and intelligent recommendations."*

---

### Slide 2: Problem Statement
- **Title**: Challenges in Modern Resume Screening
- **Bullet Points**:
  - High volume: Recruiters review hundreds of resumes with only seconds spent on each.
  - Lack of feedback: Candidates submit resumes blindly without knowing why they were rejected.
  - Subjective screening: Human fatigue leads to inconsistent hiring decisions.
  - Desktop-bound tools: Candidates lack mobile-friendly tools to evaluate job fit on the go.
- **Screenshot / Demo Visual**: Infographic illustrating candidate drop-off and recruiter screening fatigue.
- **Presenter Script**:
  > *"Every hiring cycle, hundreds of resumes are submitted for a single role. Recruiters face severe screening fatigue, while applicants receive zero feedback on missing skills or keywords. ResumeIQ solves both problems through transparent, instant compatibility evaluation."*

---

### Slide 3: Proposed Solution
- **Title**: The ResumeIQ Solution
- **Bullet Points**:
  - Instant text extraction from `.pdf` and `.docx` documents.
  - Multi-dimensional scoring: Skill Match, Keyword Alignment, and Experience Match.
  - Transparent skill gap highlighting (matched vs missing competencies).
  - Dual platform access: A full-featured web dashboard and a dedicated mobile client.
- **Screenshot / Demo Visual**: System capability diagram highlighting extraction, scoring, and feedback.
- **Presenter Script**:
  > *"ResumeIQ acts as an intelligent career copilot. By comparing the exact text of a resume against target job requirements, it computes multi-dimensional compatibility scores, flags missing qualifications, and provides actionable advice."*

---

### Slide 4: Project Objectives
- **Title**: Core Engineering Objectives
- **Bullet Points**:
  - Create a high-performance asynchronous backend in FastAPI.
  - Implement heuristic tokenizers and regex skill extractors across 36+ technical domains.
  - Build a dark-themed responsive React web application with reusable component architecture.
  - Extend the system with an Expo-powered mobile app communicating with the exact same API.
- **Screenshot / Demo Visual**: Objectives checklist showing completion status.
- **Presenter Script**:
  > *"Our primary goals were to create a unified FastAPI backend, implement robust NLP text extraction, and deliver seamless client applications across both web and mobile platforms with 100% API contract consistency."*

---

### Slide 5: System Architecture
- **Title**: High-Level System Architecture
- **Bullet Points**:
  - Decoupled 3-tier structure: Presentation, API Orchestration, Intelligence/NLP.
  - Web Client (React 19 + Vite) & Mobile Client (React Native + Expo).
  - Centralized FastAPI Service (`POST /api/resume/analyze`).
  - Google Gemini AI heuristics integration with graceful text fallback.
- **Screenshot / Demo Visual**: Architecture flow diagram (`docs/PROJECT_DOCUMENTATION.md` Section 5).
- **Presenter Script**:
  > *"As shown in our architecture diagram, both the React web application and React Native mobile application connect directly to our centralized FastAPI backend via multipart HTTP requests, ensuring unified scoring and zero logic duplication."*

---

### Slide 6: Technology Stack
- **Title**: Full Technology Stack
- **Bullet Points**:
  - **Backend**: FastAPI, Uvicorn, Python 3.10+, `pypdf`, `python-docx`.
  - **AI / NLP**: Google GenAI SDK (`gemini-2.5-flash`), Regex tokenizers.
  - **Web Frontend**: React 18/19, Vite, React Router, Recharts, Scoped CSS.
  - **Mobile Frontend**: React Native 0.76, Expo SDK 52, React Navigation, AsyncStorage.
- **Screenshot / Demo Visual**: Technology badge matrix.
- **Presenter Script**:
  > *"Our technology stack pairs the asynchronous performance of Python's FastAPI with React and Expo on the frontend, using pypdf and python-docx for reliable text extraction."*

---

### Slide 7: AI/MLOps Analysis Workflow
- **Title**: Document Parsing & Scoring Pipeline
- **Bullet Points**:
  - Step 1: Text extraction from PDF/DOCX byte stream.
  - Step 2: Alphanumeric tokenization & stopword removal.
  - Step 3: Domain skill extraction across 36+ tech stacks.
  - Step 4: ATS resume section identification (Summary, Skills, Experience, Education).
  - Step 5: Weighted formula calculation: $50\%$ Skills $+ 30\%$ Keywords $+ 20\%$ Experience.
- **Screenshot / Demo Visual**: Flowchart of the analysis pipeline.
- **Presenter Script**:
  > *"When a document is uploaded, our pipeline extracts the raw text, filters out common stopwords, detects technical competencies using curated domain dictionaries, and computes a balanced weighted match score."*

---

### Slide 8: Web Application Portal
- **Title**: Responsive Web Application
- **Bullet Points**:
  - Premium dark AI design theme (`#08090D` background, `#10121A` surface, `#6C63FF` accent).
  - Modular routing: `/upload`, `/report`, `/recruiter`, `/admin`, `/applications`.
  - Reusable component architecture (`Button`, `Card`, `StatusBadge`, `Modal`).
- **Screenshot / Demo Visual**: Web homepage and landing interface.
- **Presenter Script**:
  > *"Here is the ResumeIQ web interface. Built with React and Vite, it follows a clean dark AI career intelligence aesthetic with responsive layout design and modular components."*

---

### Slide 9: Resume Upload & Job Description
- **Title**: Candidate Upload Workspace
- **Bullet Points**:
  - File picker accepting `.pdf` and `.docx` resumes.
  - Dynamic display of chosen filename and document format.
  - Rich textarea for pasting target job descriptions.
  - Live loading state with animated spinner and status messages.
- **Screenshot / Demo Visual**: Screenshot of `Upload.jsx` form with a sample resume selected.
- **Presenter Script**:
  > *"In the analysis workspace, candidates simply select their resume file, paste the target job description, and trigger the scan. The interface displays immediate loading feedback during processing."*

---

### Slide 10: AI Analysis Results
- **Title**: Score Breakdown & Insights
- **Bullet Points**:
  - Prominent overall match score percentage.
  - Detailed score badges: Skill Match, Keyword Match, Experience Match.
  - Matched skills in green tags; missing skill gaps highlighted in amber.
  - Structured AI recommendations for resume optimization.
- **Screenshot / Demo Visual**: Screenshot of `Upload.jsx` analysis dashboard with scores and skill pills.
- **Presenter Script**:
  > *"Once evaluated, the candidate sees an instant compatibility score, a breakdown of matched versus missing competencies, identified resume sections, and actionable advice to improve their application."*

---

### Slide 11: Recruiter Evaluation Dashboard
- **Title**: Recruiter Candidate Screening
- **Bullet Points**:
  - Candidate table with live search and score/status filtering.
  - Recharts visual distribution of candidate match scores.
  - Side-by-side comparison modal comparing multiple applicants.
  - Action buttons to Shortlist or Reject candidates with recruiter feedback notes.
- **Screenshot / Demo Visual**: Screenshot of `Recruiter.jsx` dashboard and candidate comparison modal.
- **Presenter Script**:
  > *"For hiring teams, the Recruiter portal offers candidate search, status filtering, interactive Recharts telemetry, and side-by-side comparison modals to quickly identify top talent."*

---

### Slide 12: Applications Pipeline & Full Report
- **Title**: Application Tracking & Printable Audit
- **Bullet Points**:
  - Application Pipeline (`/applications`): Status tracker and history stored in `localStorage`.
  - Detailed Report (`/report`): Comprehensive compatibility audit passed via router state.
  - Browser print / PDF export capability (`window.print()`).
- **Screenshot / Demo Visual**: Screenshot of `Applications.jsx` and the printable `Report.jsx`.
- **Presenter Script**:
  > *"Candidates can monitor their submission pipeline with status badges and view or print an ATS audit report for their records."*

---

### Slide 13: Mobile Application Overview
- **Title**: Dedicated Mobile Application
- **Bullet Points**:
  - Built with React Native `0.76` and Expo `52`.
  - Clean 4-tab bottom navigation: Home, Scanner, Pipeline, Settings.
  - Native document selection via `expo-document-picker`.
  - Offline-safe data persistence using `@react-native-async-storage/async-storage`.
- **Screenshot / Demo Visual**: Screenshots of the mobile Welcome screen and Home dashboard.
- **Presenter Script**:
  > *"To ensure accessibility on the go, we created a dedicated React Native mobile app using Expo. It brings the full ResumeIQ experience to phones with a touch-friendly dark UI."*

---

### Slide 14: Mobile → Same Backend Architecture
- **Title**: Unified Backend Integration
- **Bullet Points**:
  - Connects to the **exact same** FastAPI endpoint: `POST /api/resume/analyze`.
  - Sends standard React Native `FormData` containing `{ uri, name, type }`.
  - Centralized API config with dynamic local IP resolution for physical phones.
  - Settings screen allows configuring computer LAN IP (e.g., `http://10.124.2.11:8000`) with live connection probe.
- **Screenshot / Demo Visual**: Mobile Settings screen showing the live backend connection status.
- **Presenter Script**:
  > *"Crucially, the mobile application does not require a second backend. It communicates directly with the same FastAPI server over multipart HTTP, with built-in LAN IP configuration for real physical phone testing."*

---

### Slide 15: Testing & Validation
- **Title**: Verification & Production Readiness
- **Bullet Points**:
  - API Verification: Tested `POST /api/resume/analyze` using real `.docx` documents.
  - Network Verification: FastAPI tested over both `127.0.0.1` and LAN IP `10.124.2.11`.
  - Web Production Build: `vite build` completed cleanly (609 modules, 244ms).
  - Mobile Production Export: `expo export -p android` bundled cleanly (816 modules).
- **Screenshot / Demo Visual**: Terminal logs showing successful builds and API test outputs.
- **Presenter Script**:
  > *"Both environments have been thoroughly tested. Our FastAPI server was verified across local and LAN networks, our web bundle passed production Vite build, and the mobile bundle passed Expo production export."*

---

### Slide 16: Key Results & Outcomes
- **Title**: System Performance & Results
- **Bullet Points**:
  - 100% API contract consistency across Web and Mobile.
  - Sub-second resume analysis and scoring computation.
  - Resilient backend startup with graceful AI fallback.
  - Persistent candidate tracking without requiring complex database overhead.
- **Screenshot / Demo Visual**: Graph comparing processing speed and contract alignment.
- **Presenter Script**:
  > *"In testing, ResumeIQ consistently delivered sub-second resume scoring, accurate skill detection, and flawless contract consistency between web and mobile clients."*

---

### Slide 17: Member 4 Contributions
- **Title**: Member 4 Contributions (Frontend & Mobile Integration)
- **Bullet Points**:
  - Designed and created the reusable component system (`Button`, `Card`, `StatusBadge`, `Modal`).
  - Integrated components across `Applications.jsx`, `Recruiter.jsx`, and `Admin.jsx`.
  - Connected Candidate Applications tracking with offline-first persistence.
  - Built the entire React Native + Expo mobile application (`mobile/`) from scratch.
  - Integrated mobile file upload with the shared FastAPI backend and verified production builds.
- **Screenshot / Demo Visual**: Summary grid of Member 4 files and components.
- **Presenter Script**:
  > *"As Member 4, my responsibility was frontend engineering and cross-platform integration. I built the reusable component system, implemented candidate tracking, and developed the entire mobile application to connect seamlessly with our FastAPI backend."*

---

### Slide 18: Limitations & Future Enhancements
- **Title**: Future Roadmap
- **Bullet Points**:
  - Optical Character Recognition (OCR) for scanned image resumes.
  - Centralized PostgreSQL cloud database with candidate/recruiter authentication.
  - Expanded LLM role-specific interview preparation quizzes.
  - Cloud deployment to AWS / Google Cloud Run and Vercel.
- **Screenshot / Demo Visual**: Roadmap timeline diagram.
- **Presenter Script**:
  > *"In future iterations, we plan to incorporate OCR for scanned documents, introduce centralized PostgreSQL user accounts, and deploy the backend to cloud containers."*

---

### Slide 19: Conclusion
- **Title**: Project Summary
- **Bullet Points**:
  - Delivered an end-to-end, multi-platform career intelligence system.
  - Solved resume screening bottlenecks with objective, multi-factor scoring.
  - Successfully demonstrated unified backend sharing between React web and Expo mobile.
  - Ready for deployment and production usage.
- **Screenshot / Demo Visual**: Full ecosystem visual showing Candidate and Recruiter portals.
- **Presenter Script**:
  > *"To conclude, ResumeIQ successfully demonstrates how modern web, mobile, and AI technologies can unite to create a transparent, objective, and efficient career intelligence platform."*

---

### Slide 20: Thank You / Q&A
- **Title**: Thank You
- **Bullet Points**:
  - Project Repository: `github.com/dhathri746/ResumeIQ-Frontend`
  - Questions & Discussion.
- **Screenshot / Demo Visual**: QR code linking to GitHub repository.
- **Presenter Script**:
  > *"Thank you for your time. We are now open to any questions or feedback from the panel."*

---

## 🎬 18-Step Live Demonstration Script

| Step | Action | What to Show on Screen | What to Say |
| :---: | :--- | :--- | :--- |
| **1** | Open Web Browser | `http://localhost:5173/` | *"Here is the ResumeIQ homepage highlighting our core capabilities."* |
| **2** | Navigate to Upload | Click **Analyze Resume** (`/upload`) | *"We navigate to the candidate analysis workspace."* |
| **3** | Choose Resume File | Select a sample `.docx` or `.pdf` resume | *"We select a resume document. The UI displays the selected filename."* |
| **4** | Input Job Description | Paste target job requirements (e.g. Software Engineer role) | *"Next, we paste the target job description containing required skills."* |
| **5** | Submit Analysis | Click **Analyze Resume** | *"Clicking Analyze Resume triggers the multipart upload to FastAPI."* |
| **6** | Display Score | Analysis Dashboard appears with overall match score (e.g. 79%) | *"Within seconds, our backend evaluates the document and returns a 79% match."* |
| **7** | Explain Metrics | Point to Skill Match, Keyword Match, Experience Match | *"The score is broken down into specific skill, keyword, and experience matches."* |
| **8** | Show Skills & Gaps | Point to Matched Skills pills vs Missing Skills pills | *"Here we see matched competencies in green, alongside missing skill gaps in amber."* |
| **9** | Show Recommendations | Scroll to Recommendations section | *"The candidate receives targeted advice on how to improve their alignment."* |
| **10** | Open Full Report | Click **View Full Report** (`/report`) | *"Clicking Full Report opens the comprehensive audit, ready for printing or PDF save."* |
| **11** | Open Recruiter Portal | Navigate to `/recruiter` in navbar | *"Switching to the Recruiter view, hiring managers can filter and search candidates."* |
| **12** | Compare Candidates | Select 2 candidates and click **Compare Candidates** | *"Recruiters can compare multiple applicants side-by-side to make objective decisions."* |
| **13** | Open Mobile App | Launch Expo app on mobile / simulator | *"Now we transition to the mobile application built with React Native and Expo."* |
| **14** | Show Mobile Scanner | Tap the **Scanner** tab in bottom navigation | *"The mobile app features a dedicated Scanner tab with native document picking."* |
| **15** | Run Mobile Scan | Select a document, enter job description, tap **Analyze** | *"We submit the resume directly from mobile to the exact same FastAPI backend."* |
| **16** | View Mobile Results | Result screen opens showing scores, pills, recommendations | *"The mobile screen renders the identical score breakdown and skill gap tags."* |
| **17** | Verify Same Backend | Tap **Settings** tab and tap **Test Connection** | *"In Settings, our live health check confirms the app communicates with the same server."* |
| **18** | Conclude Demo | Return to presentation / summary | *"This completes our demonstration of the ResumeIQ web and mobile ecosystem. Thank you!"* |

