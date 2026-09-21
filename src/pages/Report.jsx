import { Link, useLocation } from 'react-router-dom'

function Report() {
  const location = useLocation()
  const result = location.state?.result

  if (!result) {
    return (
      <div className="report-page">
        <div className="report-empty">
          <h1>No Report Available</h1>

          <p>
            Please analyze a resume first to generate a report.
          </p>

          <Link to="/upload" className="report-back-btn">
            Analyze Resume
          </Link>
        </div>
      </div>
    )
  }

  const analysis = result.analysis

  const advanced = analysis.advanced_analysis || {}

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="report-page">

      {/* Report Header */}
      <header className="report-header">

        <div className="report-brand">
          Resume<span>IQ</span>
        </div>

        <div className="report-actions">
          <button
            className="print-btn"
            onClick={handlePrint}
          >
            Print / Save PDF
          </button>

          <Link to="/upload" className="back-btn">
            Back to Analysis
          </Link>
        </div>

      </header>

      <main className="report-container">

        {/* Title */}
        <section className="report-title">

          <p>RESUME ANALYSIS REPORT</p>

          <h1>
            Resume Compatibility Report
          </h1>

          <span>
            {result.filename}
          </span>

        </section>

        {/* Score */}
        <section className="report-score-section">

          <div className="report-score">
            <div className="report-score-ring">
              <strong>
                {analysis.score}%
              </strong>

              <span>
                Overall Match
              </span>
            </div>
          </div>

          <div className="report-summary">

            <h2>
              Resume Compatibility
            </h2>

            <p>
              This report summarizes how well the candidate's
              resume aligns with the provided job description.
            </p>

          </div>

        </section>

        {/* Key Metrics */}
        <section className="report-section">

          <h2>Key Analysis Metrics</h2>

          <div className="report-metrics">

            <div className="report-metric-card">
              <span>Skill Match</span>
              <strong>
                {advanced.skill_match_score ?? 0}%
              </strong>
              <p>Skills aligned with the job requirements.</p>
            </div>

            <div className="report-metric-card">
              <span>Keyword Match</span>
              <strong>
                {advanced.keyword_match_score ?? 0}%
              </strong>
              <p>Important job keywords found in the resume.</p>
            </div>

            <div className="report-metric-card">
              <span>Experience Match</span>
              <strong>
                {advanced.experience_match_score ?? 0}%
              </strong>
              <p>Experience alignment with the role.</p>
            </div>

          </div>

        </section>

        {/* Skills */}
        <section className="report-section">

          <h2>Skills Analysis</h2>

          <div className="report-two-column">

            <div className="report-list-card">

              <h3>Matched Skills</h3>

              {analysis.skills?.length > 0 ? (
                <div className="skill-pill-list">
                  {analysis.skills.map((skill) => (
                    <span key={skill} className="skill-pill matched">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No matching skills found.</p>
              )}

            </div>

            <div className="report-list-card missing-report">

              <h3>Missing Skills</h3>

              {analysis.missing_skills?.length > 0 ? (
                <div className="skill-pill-list">
                  {analysis.missing_skills.map((skill) => (
                    <span key={skill} className="skill-pill missing">
                      ⚠ {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p>
                  No major missing skills found.
                </p>
              )}

            </div>

          </div>

        </section>

        {/* Strengths */}
        <section className="report-section">

          <h2>Candidate Strengths</h2>

          <div className="report-list-card strengths-card">

            {analysis.strengths?.length > 0 ? (
              <ul className="strengths-list">
                {analysis.strengths.map((strength) => (
                  <li key={strength}>
                    <span className="strength-check">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                No specific strengths identified.
              </p>
            )}

          </div>

        </section>

        {/* Keywords */}
        <section className="report-section">

          <h2>Matched Keywords</h2>

          <div className="keyword-container">

            {advanced.matched_keywords?.length > 0 ? (

              advanced.matched_keywords.map((keyword) => (
                <span
                  className="keyword-tag"
                  key={keyword}
                >
                  {keyword}
                </span>
              ))

            ) : (

              <p>
                No important keywords matched.
              </p>

            )}

          </div>

        </section>

        {/* Resume Sections */}
        <section className="report-section">

          <h2>Resume Sections</h2>

          <div className="section-status-grid">

            {Object.entries(
              advanced.resume_sections || {}
            ).map(([section, present]) => (

              <div
                className={`section-status ${
                  present ? 'present' : 'missing'
                }`}
                key={section}
              >

                <span className="section-status-icon">
                  {present ? '✓' : '⚠'}
                </span>

                <div className="section-status-text">
                  <strong>
                    {section.charAt(0).toUpperCase() +
                      section.slice(1)}
                  </strong>
                  <small>{present ? 'Present' : 'Missing'}</small>
                </div>

              </div>

            ))}

          </div>

        </section>

        {/* Recommendations */}
        <section className="report-section">

          <h2>Recommendations</h2>

          <div className="recommendations-report">

            {analysis.recommendations?.length > 0 ? (

              <ol className="recommendations-list">

                {analysis.recommendations.map(
                  (recommendation, index) => (

                    <li key={index} className="recommendation-item">
                      <span className="recommendation-number">
                        {index + 1}
                      </span>
                      <span>{recommendation}</span>
                    </li>

                  )
                )}

              </ol>

            ) : (

              <p>
                Your resume is well aligned with this job.
              </p>

            )}

          </div>

        </section>

        {/* Footer */}
        <footer className="report-footer">

          <strong>
            ResumeIQ
          </strong>

          <p>
            AI-powered resume analysis and career insights.
          </p>

        </footer>

      </main>

    </div>
  )
}

export default Report