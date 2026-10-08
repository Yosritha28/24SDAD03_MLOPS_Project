# ResumeIQ

ResumeIQ is an AI-powered resume screening and career intelligence platform built for both web and mobile users. It analyzes uploaded resumes against a job description, identifies skill and keyword gaps, calculates compatibility scores, and presents actionable recommendations to both candidates and recruiters.

## Project Overview

The system uses a shared FastAPI backend and a single resume analysis pipeline for both frontends:

- Web frontend: React + Vite
- Mobile frontend: React Native + Expo
- Backend: FastAPI + Python
- AI analysis: Gemini-powered recommendations with graceful fallback behavior

## Member 4 Contribution

Member 4 — Frontend & Integration

- Built the responsive web frontend and recruiter/admin interfaces
- Connected the React frontend to the shared FastAPI backend
- Integrated upload, report, applications, and dashboard flows
- Developed the Expo mobile application using the same backend contract
- Verified API behavior, build output, and client-side workflows

## Architecture

WEB
↓
FastAPI Backend
↓
AI/MLOps Resume Analysis

MOBILE
↓
Same FastAPI Backend
↓
Same AI/MLOps Resume Analysis

## Key Features

- Resume upload in PDF and DOCX formats
- Job description comparison and match scoring
- Skill, keyword, and experience analysis
- Matched and missing skill breakdown
- Strengths and recommendations
- Recruiter dashboard with charts and candidate comparison
- Applications tracking and report viewing
- Mobile app for upload, results, and report viewing

## Backend API

- GET /
- POST /api/resume/analyze

## Documentation

- Project documentation: [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md)
- Presentation and demo guide: [docs/PRESENTATION_AND_DEMO_GUIDE.md](docs/PRESENTATION_AND_DEMO_GUIDE.md)
- API test report: [POSTMAN_TEST_REPORT.md](POSTMAN_TEST_REPORT.md)

## Repository Structure

- src/ — web frontend
- mobile/ — Expo mobile application
- backend/ — FastAPI backend and service logic
- docs/ — project documentation and presentation materials

## Technologies Used

- React
- Vite
- React Native
- Expo
- FastAPI
- Python
- pypdf
- python-docx
- Recharts
- Google GenAI

## Local Verification

The project has been verified with live API testing and web build checks.

## GitHub

- Group repository: https://github.com/Yosritha28/24SDAD03_MLOPS_Project
- Personal repository: https://github.com/dhathri746/ResumeIQ-Frontend
