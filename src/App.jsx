import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './App.css'

import Upload from './pages/Upload'
import Recruiter from './pages/Recruiter'
import Report from './pages/Report'
import Admin from './pages/Admin'
import Applications from './pages/Applications'

function Home() {
  return (
    <div className="landing">

      {/* Navigation Bar */}
      <nav className="navbar riq-nav">
        <div className="navbar-inner">
          <div className="logo">
            Resume<span>IQ</span>
          </div>

          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <Link to="/recruiter">Recruiter</Link>
            <Link to="/admin">Admin</Link>
            <Link to="/applications">Applications</Link>

            <Link to="/upload" className="login-btn">
              Analyze Resume
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-inner">
          <div className="hero-content">
            <p className="tagline">
              AI-POWERED RESUME INTELLIGENCE
            </p>

            <h1>
              Understand Your Resume.
              Improve Your Career.
            </h1>

            <p className="description">
              ResumeIQ reads your resume, compares it against real job
              descriptions, and shows exactly what to improve — skills,
              keywords, experience, and next steps.
            </p>

            <div className="hero-actions">
              <Link to="/upload" className="analyze-btn">
                Analyze My Resume
              </Link>
              <Link to="/applications" className="secondary-btn">
                View Applications
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <p className="hero-card-label">RESUME ANALYSIS</p>
              <div className="hero-score">
                <strong>75%</strong>
                <span>Overall Match</span>
              </div>
              <div className="hero-metrics">
                <div className="hero-metric">
                  <span>Skill Match</span>
                  <strong>100%</strong>
                </div>
                <div className="hero-metric">
                  <span>Keyword Match</span>
                  <strong>49%</strong>
                </div>
                <div className="hero-metric">
                  <span>Experience Match</span>
                  <strong>50%</strong>
                </div>
              </div>
              <div className="hero-tags">
                <span>Python</span>
                <span>Java</span>
                <span>React</span>
                <span>MySQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-inner">
          <p className="section-eyebrow">PLATFORM</p>
          <h2>Everything you need to get hired</h2>
          <p className="section-subtitle">
            A focused toolkit for understanding your resume and improving your job match.
          </p>

          <div className="features-container">

            <div className="feature-card">
              <div className="feature-icon">Resume Analysis</div>

              <h3>Resume Analysis</h3>

              <p>
                Upload a PDF or DOCX resume and receive a structured
                breakdown of skills, sections, and alignment.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">Job Matching</div>

              <h3>Job Matching</h3>

              <p>
                Compare your resume against any job description with
                skill, keyword, and experience scoring.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">Skill Recommendations</div>

              <h3>Skill Recommendations</h3>

              <p>
                See missing skills and receive practical next steps
                to strengthen your candidacy.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="section-inner about-inner">
          <p className="section-eyebrow">ABOUT</p>
          <h2>Career intelligence, without the noise</h2>

          <p>
            ResumeIQ combines document parsing, skill matching, and AI
            recommendations into one clear report — so candidates know
            what recruiters see, and recruiters see who truly fits.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-inner cta-inner">
          <h2>Ready to understand your resume better?</h2>
          <p>Upload your resume and get a clear compatibility report in seconds.</p>
          <Link to="/upload" className="analyze-btn">
            Analyze My Resume
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="logo">
            Resume<span>IQ</span>
          </div>
          <p>© 2026 ResumeIQ. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/upload" element={<Upload />} />

        <Route path="/recruiter" element={<Recruiter />} />

        <Route path="/report" element={<Report />} />

        <Route path="/admin" element={<Admin />} />

      <Route path="/applications" element={<Applications />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App