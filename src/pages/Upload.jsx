import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Upload() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
    setResult(null)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!file) {
      alert('Please upload your resume first.')
      return
    }

    if (!jobDescription.trim()) {
      alert('Please enter the job description.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()

    formData.append('resume_file', file)
    formData.append('job_description', jobDescription)

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/resume/analyze',
        {
          method: 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to analyze resume')
      }

      setResult(data)
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-page">

      <div className="upload-container">

        <h1>Analyze Your Resume</h1>

        <p>
          Upload your resume and provide a job description
          to get your personalized analysis.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="upload-box">
            <h2>Upload Resume</h2>

            <p>Supported formats: PDF, DOCX</p>

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />

            {file && (
              <p className="selected-file">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="job-box">
            <h2>Job Description</h2>

            <textarea
              placeholder="Paste the job description here..."
              rows="8"
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="analyze-btn"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>

        </form>

        {error && (
          <div className="error-message">
            <h3>Analysis Failed</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="analysis-dashboard">

            {/* Dashboard Header */}

            <div className="dashboard-header">
              <div>
                <h2>Resume Analysis</h2>
                <p>{result.filename}</p>
              </div>

              <button
                type="button"
                className="view-report-btn"
                onClick={() => navigate('/report', { state: { result } })}
              >
                View Full Report
              </button>
            </div>

            {/* Overall Score */}

            <div className="score-card">

              <div className="score-number">
                {result.analysis.score}%
              </div>

              <div>
                <h3>Resume Match Score</h3>

                <p>
                  Overall compatibility between your resume
                  and the job description.
                </p>
              </div>

            </div>

            {/* Basic Analysis */}

            <div className="analysis-grid">

              <div className="analysis-card">

                <h3>Matched Skills</h3>

                {result.analysis.skills.length > 0 ? (
                  <ul>
                    {result.analysis.skills.map((skill) => (
                      <li key={skill}>
                        ✓ {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No matching skills found.</p>
                )}

              </div>

              <div className="analysis-card">

                <h3>Strengths</h3>

                {result.analysis.strengths.length > 0 ? (
                  <ul>
                    {result.analysis.strengths.map((strength) => (
                      <li key={strength}>
                        ✓ {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No strengths identified.</p>
                )}

              </div>

              <div className="analysis-card missing-card">

                <h3>Missing Skills</h3>

                {result.analysis.missing_skills.length > 0 ? (
                  <ul>
                    {result.analysis.missing_skills.map((skill) => (
                      <li key={skill}>
                        ⚠ {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No major missing skills found.</p>
                )}

              </div>

            </div>

            {/* Advanced Analysis */}

            {result.analysis.advanced_analysis && (
              <div className="advanced-analysis">

                <div className="dashboard-header">
                  <h2>Advanced Analysis</h2>
                  <p>
                    Detailed analysis of your resume against
                    the job requirements.
                  </p>
                </div>

                <div className="analysis-grid">

                  {/* Skill Match */}

                  <div className="analysis-card">
                    <h3>Skill Match</h3>

                    <div className="score-number">
                      {result.analysis.advanced_analysis.skill_match_score}%
                    </div>

                    <p>
                      Technical skills matching the job description.
                    </p>
                  </div>

                  {/* Keyword Match */}

                  <div className="analysis-card">
                    <h3>Keyword Match</h3>

                    <div className="score-number">
                      {result.analysis.advanced_analysis.keyword_match_score}%
                    </div>

                    <p>
                      Important job-related keywords found in your resume.
                    </p>
                  </div>

                  {/* Experience Match */}

                  <div className="analysis-card">
                    <h3>Experience Match</h3>

                    <div className="score-number">
                      {result.analysis.advanced_analysis.experience_match_score}%
                    </div>

                    <p>
                      Experience alignment with the job requirements.
                    </p>
                  </div>

                </div>

                {/* Matched Keywords */}

                <div className="analysis-card">

                  <h3>Matched Keywords</h3>

                  {result.analysis.advanced_analysis.matched_keywords?.length > 0 ? (
                    <ul>
                      {result.analysis.advanced_analysis.matched_keywords.map(
                        (keyword) => (
                          <li key={keyword}>
                            ✓ {keyword}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p>No important keywords matched.</p>
                  )}

                </div>

                {/* Resume Sections */}

                <div className="analysis-card">

                  <h3>Resume Sections</h3>

                  <ul>

                    {Object.entries(
                      result.analysis.advanced_analysis.resume_sections || {}
                    ).map(([section, present]) => (

                      <li key={section}>
                        {present ? '✓' : '⚠'}{' '}
                        {section.charAt(0).toUpperCase() +
                          section.slice(1)}
                      </li>

                    ))}

                  </ul>

                </div>

              </div>
            )}

            {/* Recommendations */}

            {result.analysis.recommendations && (
              <div className="analysis-card recommendations-card">

                <h2>Recommendations</h2>

                {result.analysis.recommendations.length > 0 ? (
                  <ul>

                    {result.analysis.recommendations.map(
                      (recommendation, index) => (
                        <li key={index}>
                          💡 {recommendation}
                        </li>
                      )
                    )}

                  </ul>
                ) : (
                  <p>
                    Your resume is well aligned with this job.
                  </p>
                )}

              </div>
            )}

            {/* View Full Report Action */}
            <div className="report-action-container">
              <button
                type="button"
                className="view-report-btn"
                onClick={() => navigate('/report', { state: { result } })}
              >
                View Full Report
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  )
}

export default Upload