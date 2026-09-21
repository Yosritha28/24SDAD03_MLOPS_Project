import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './App.css'

import Upload from './pages/Upload'
import Recruiter from './pages/Recruiter'
import Report from './pages/Report'
import Admin from './pages/Admin'
import Applications from './pages/Applications'

function Home() {
  return (
    <div className="app">

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">
          Resume<span>IQ</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/recruiter">Recruiter</Link>
          <Link to="/admin">Admin</Link>

          <Link to="/upload" className="login-btn">
            Login
          </Link>
          <Link to="/applications" className="login-btn">My Applications</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="tagline">
            AI-POWERED RESUME ANALYZER
          </p>

          <h1>
            Build a Better Career with
            <span> ResumeIQ</span>
          </h1>

          <p className="description">
            Upload your resume and discover your skills, job match,
            missing skills, and personalized career recommendations.
          </p>

          <Link to="/upload" className="analyze-btn">
            Analyze My Resume
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2>What ResumeIQ Can Do</h2>

        <div className="features-container">

          <div className="feature-card">
            <div className="feature-icon">📄</div>

            <h3>Resume Analysis</h3>

            <p>
              Upload your resume and let our system analyze
              your skills and experience.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>

            <h3>Job Matching</h3>

            <p>
              Compare your resume with job descriptions and
              get a matching score.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>

            <h3>Skill Recommendations</h3>

            <p>
              Discover missing skills and get recommendations
              to improve your career profile.
            </p>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2>About ResumeIQ</h2>

        <p>
          ResumeIQ is an AI-powered platform designed to help
          candidates understand their resume and find better
          career opportunities.
        </p>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 ResumeIQ. All rights reserved.</p>
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