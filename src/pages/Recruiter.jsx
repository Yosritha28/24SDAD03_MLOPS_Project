import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

// Reusable UI components
import Button from '../components/Button'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import LoadingState from '../components/LoadingState'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'

const INITIAL_CANDIDATES = [
  {
    id: 'cand-01',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@email.com',
    role: 'Software Engineer',
    match: 92,
    status: 'Shortlisted',
    skills: ['Python', 'FastAPI', 'React', 'Docker', 'PostgreSQL'],
    missingSkills: ['Kubernetes'],
    experience: '4 years of experience developing full-stack web applications and microservices.',
    education: 'B.S. in Computer Science, Stanford University',
    rating: 5,
    feedback: 'Excellent problem solving skills, great match for the platform engineering team.'
  },
  {
    id: 'cand-02',
    name: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    role: 'Backend Developer',
    match: 86,
    status: 'Under Review',
    skills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'Redis'],
    missingSkills: ['FastAPI', 'Docker'],
    experience: '3.5 years of backend engineering experience with high-throughput distributed systems.',
    education: 'B.S. in Software Engineering, UT Austin',
    rating: 4,
    feedback: 'Solid backend fundamentals; may need quick ramp-up on Docker & containerization.'
  },
  {
    id: 'cand-03',
    name: 'David Kim',
    email: 'david.kim@email.com',
    role: 'Full Stack Developer',
    match: 74,
    status: 'Pending',
    skills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'MongoDB'],
    missingSkills: ['Python', 'FastAPI', 'SQL'],
    experience: '2 years of experience building modern React web applications.',
    education: 'B.A. in Information Systems, UC Berkeley',
    rating: 3,
    feedback: 'Strong frontend capabilities, but job requires deeper Python backend proficiency.'
  },
  {
    id: 'cand-04',
    name: 'Elena Rostova',
    email: 'elena.rostova@email.com',
    role: 'Senior Software Engineer',
    match: 95,
    status: 'Shortlisted',
    skills: ['Python', 'FastAPI', 'React', 'Docker', 'AWS', 'PostgreSQL', 'Git'],
    missingSkills: [],
    experience: '6 years of experience architecting cloud-native AI-driven web platforms.',
    education: 'M.S. in Computer Science, Carnegie Mellon University',
    rating: 5,
    feedback: 'Outstanding technical match across all requirements. Strong leadership qualities.'
  },
  {
    id: 'cand-05',
    name: 'Marcus Chen',
    email: 'marcus.chen@email.com',
    role: 'DevOps & Cloud Engineer',
    match: 81,
    status: 'Under Review',
    skills: ['Python', 'Docker', 'AWS', 'Git', 'Linux', 'SQL'],
    missingSkills: ['React', 'FastAPI'],
    experience: '3 years of infrastructure automation and cloud deployment.',
    education: 'B.S. in Computer Engineering, Georgia Tech',
    rating: 4,
    feedback: 'Great cloud and containerization background, solid scripting skills.'
  },
  {
    id: 'cand-06',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    role: 'Junior Software Engineer',
    match: 65,
    status: 'Rejected',
    skills: ['Python', 'HTML', 'CSS', 'Git'],
    missingSkills: ['FastAPI', 'React', 'Docker', 'SQL'],
    experience: '1 year of internship experience in Python scripting and web basics.',
    education: 'B.Tech in Computer Science, Delhi Technological University',
    rating: 2,
    feedback: 'Needs more hands-on experience with modern full stack frameworks and databases.'
  }
]

function Recruiter() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [scoreFilter, setScoreFilter] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Modals state
  const [viewCandidate, setViewCandidate] = useState(null)
  const [feedbackInput, setFeedbackInput] = useState('')
  const [ratingInput, setRatingInput] = useState(5)
  const [feedbackSaved, setFeedbackSaved] = useState(false)

  // Comparison state
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  // Toast notification helper
  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  // Filter candidates based on search, status, and score
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter

      let matchesScore = true
      if (scoreFilter === '90+') matchesScore = c.match >= 90
      else if (scoreFilter === '80+') matchesScore = c.match >= 80
      else if (scoreFilter === '70+') matchesScore = c.match >= 70
      else if (scoreFilter === '<70') matchesScore = c.match < 70

      return matchesSearch && matchesStatus && matchesScore
    })
  }, [candidates, searchQuery, statusFilter, scoreFilter])

  // Dynamic statistics
  const stats = useMemo(() => {
    const total = candidates.length
    const shortlisted = candidates.filter((c) => c.status === 'Shortlisted').length
    const avgMatch =
      total > 0
        ? Math.round(candidates.reduce((sum, c) => sum + c.match, 0) / total)
        : 0
    return { total, shortlisted, avgMatch, jobsPosted: 6 }
  }, [candidates])

  // Dynamic chart data
  const candidateMatchData = useMemo(() => {
    return candidates.slice(0, 5).map((c) => ({
      candidate: c.name.split(' ')[0],
      match: c.match
    }))
  }, [candidates])

  const candidateStatusData = useMemo(() => {
    const shortlisted = candidates.filter((c) => c.status === 'Shortlisted').length
    const underReview = candidates.filter((c) => c.status === 'Under Review').length
    const pending = candidates.filter((c) => c.status === 'Pending').length
    const rejected = candidates.filter((c) => c.status === 'Rejected').length
    return [
      { name: 'Shortlisted', value: shortlisted },
      { name: 'Under Review', value: underReview },
      { name: 'Pending', value: pending },
      { name: 'Rejected', value: rejected }
    ].filter((item) => item.value > 0)
  }, [candidates])

  // Action: Shortlist candidate
  const handleShortlist = (candidateId, e) => {
    if (e) e.stopPropagation()
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'Shortlisted' } : c))
    )
    if (viewCandidate && viewCandidate.id === candidateId) {
      setViewCandidate((prev) => ({ ...prev, status: 'Shortlisted' }))
    }
    const candidate = candidates.find((c) => c.id === candidateId)
    showToast(`${candidate ? candidate.name : 'Candidate'} shortlisted successfully!`)
  }

  // Action: Reject candidate
  const handleReject = (candidateId, e) => {
    if (e) e.stopPropagation()
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'Rejected' } : c))
    )
    if (viewCandidate && viewCandidate.id === candidateId) {
      setViewCandidate((prev) => ({ ...prev, status: 'Rejected' }))
    }
    const candidate = candidates.find((c) => c.id === candidateId)
    showToast(`${candidate ? candidate.name : 'Candidate'} marked as rejected.`)
  }

  // Action: View candidate details
  const handleOpenDetails = (candidate) => {
    setViewCandidate(candidate)
    setFeedbackInput(candidate.feedback || '')
    setRatingInput(candidate.rating || 5)
    setFeedbackSaved(false)
  }

  const handleCloseDetails = () => {
    setViewCandidate(null)
    setFeedbackSaved(false)
  }

  // Action: Save feedback
  const handleSaveFeedback = (e) => {
    e.preventDefault()
    if (!viewCandidate) return

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === viewCandidate.id
          ? { ...c, feedback: feedbackInput, rating: Number(ratingInput) }
          : c
      )
    )
    setViewCandidate((prev) => ({
      ...prev,
      feedback: feedbackInput,
      rating: Number(ratingInput)
    }))
    setFeedbackSaved(true)
    showToast(`Feedback saved for ${viewCandidate.name}`)
  }

  // Action: Toggle compare selection
  const handleToggleCompare = (candidateId) => {
    setSelectedCandidateIds((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const handleClearCompare = () => {
    setSelectedCandidateIds([])
    setShowCompareModal(false)
  }

  const selectedCandidatesForCompare = useMemo(() => {
    return candidates.filter((c) => selectedCandidateIds.includes(c.id))
  }, [candidates, selectedCandidateIds])

  // Refresh handler to simulate loading state
  const handleRefresh = () => {
    setLoading(true)
    setError('')
    setTimeout(() => {
      setLoading(false)
      showToast('Candidate data refreshed.')
    }, 600)
  }

  return (
        <Card className="recruiter-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="recruiter-toast">
          <span>✓</span> {toastMessage}
        </div>
      )}

      {/* Navbar */}
      <nav className="recruiter-navbar">
        <div className="logo">
          Resume<span>IQ</span>
        </div>

        <div className="recruiter-nav-links">
          <Link to="/">Home</Link>
          <Link to="/upload">Candidate</Link>
          <span className="active">Recruiter</span>
          <Link to="/admin">Admin</Link>
        </div>
      </nav>

      <main className="recruiter-content">
        {/* Header */}
        <div className="recruiter-header">
          <div>
            <p className="recruiter-tag">RECRUITER PORTAL</p>
            <h1>Find the right talent faster.</h1>
            <p>
              Review candidate profiles, compare job compatibility,
              and identify the strongest candidates with ResumeIQ.
            </p>
          </div>

          <div className="recruiter-header-actions">
            <Button className="refresh-btn" onClick={handleRefresh} disabled={loading}>
           {loading ? 'Refreshing...' : '↻ Refresh Data'}
           </Button>
            <Button className="add-job-btn">+ Add Job</Button>
          </div>
        </div>

        {/* Backend API Dependency Notice */}
        <div className="recruiter-notice-banner">
          <span>ℹ️ Notice:</span> Recruiter candidate workflows and state management are functional in the frontend. Full persistent cloud synchronization requires Backend Recruiter APIs (Member 3 responsibility).
        </div>

        {/* Statistics */}
        <section className="recruiter-stats">
          <div className="stat-card">
            <span>Total Candidates</span>
            <strong>{stats.total}</strong>
          </div>

          <div className="stat-card">
            <span>Jobs Posted</span>
            <strong>{stats.jobsPosted}</strong>
          </div>

          <div className="stat-card">
            <span>Shortlisted</span>
            <strong>{stats.shortlisted}</strong>
          </div>

          <div className="stat-card">
            <span>Average Match</span>
            <strong>{stats.avgMatch}%</strong>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="analytics-section">
          <div className="analytics-header">
            <div>
              <p className="recruiter-tag">RECRUITMENT ANALYTICS</p>
              <h2>Candidate Insights</h2>
              <p>Visual overview of candidate compatibility and status.</p>
            </div>
          </div>

          <div className="charts-grid">
            {/* Match Score Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Candidate Match Scores</h3>
                <p>Resume compatibility by candidate</p>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={candidateMatchData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="candidate" />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, 'Match']} />
                    <Bar
                      dataKey="match"
                      name="Match Score"
                      fill="#4f46e5"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Chart */}
            <div className="chart-card">
              <div className="chart-card-header">
                <h3>Candidate Status</h3>
                <p>Current recruitment pipeline</p>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={candidateStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      label
                    >
                      {candidateStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === 'Shortlisted'
                              ? '#16a34a'
                              : entry.name === 'Under Review'
                              ? '#f97316'
                              : entry.name === 'Rejected'
                              ? '#ef4444'
                              : '#4f46e5'
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Candidate Overview Section */}
        <section className="candidate-section">
          <div className="section-heading">
            <div>
              <h2>Candidate Overview</h2>
              <p>Review candidates based on resume compatibility.</p>
            </div>

            <div className="section-heading-actions">
            <Button className={`filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide Filters' : '🔍 Filter & Search'}</Button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          {showFilters && (
            <div className="recruiter-filter-toolbar">
              <div className="filter-group">
                <label>Search Candidate / Skill</label>
                <input
                  type="text"
                  placeholder="e.g. Sarah, Python, React, Engineer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-search-input"
                />
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Statuses</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Min Match Score</label>
                <select
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Scores</option>
                  <option value="90+">90% and above</option>
                  <option value="80+">80% and above</option>
                  <option value="70+">70% and above</option>
                  <option value="<70">Below 70%</option>
                </select>
              </div>

              <Button className="reset-filter-btn" onClick={() => { setSearchQuery(''); setStatusFilter('All'); setScoreFilter('All'); }}>
  Reset
</Button>
            </div>
          )}

          {/* Compare Floating Toolbar */}
          {selectedCandidateIds.length > 0 && (
            <div className="compare-floating-bar">
              <div>
                <strong>{selectedCandidateIds.length}</strong> candidate(s) selected for comparison
                {selectedCandidateIds.length < 2 && (
                  <span className="compare-hint"> (select at least 2 to compare)</span>
                )}
              </div>

              <div className="compare-actions">
                <Button className="compare-now-btn" disabled={selectedCandidateIds.length < 2} onClick={() => setShowCompareModal(true)}>Compare Candidates ({selectedCandidateIds.length})</Button>
                <Button className="clear-compare-btn" onClick={handleClearCompare}>Clear</Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingState message="Loading candidate records..." />}


          {/* Error State */}
                    {error && <ErrorState title="Failed to load candidate records" message={error} onRetry={handleRefresh} retryLabel="Retry" />}

          {/* Empty State — shown only when the filtered result set is genuinely empty */}
          {!loading && !error && filteredCandidates.length === 0 && (
            <EmptyState title="No Candidates Found" description="No candidates match your current search and filter criteria." actionLabel="Clear Filters" onAction={() => { setSearchQuery(''); setStatusFilter('All'); setScoreFilter('All'); }} />
          )}


          {/* Candidate Table */}
          {!loading && !error && filteredCandidates.length > 0 && (
            <div className="table-responsive-container">
              <div className="candidate-table">
                <div className="table-header">
                  <span>Compare</span>
                  <span>Candidate</span>
                  <span>Role</span>
                  <span>Match</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>

                {filteredCandidates.map((candidate) => (
                  <div className="candidate-row" key={candidate.id}>
                    <div className="compare-checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedCandidateIds.includes(candidate.id)}
                        onChange={() => handleToggleCompare(candidate.id)}
                        title="Select for comparison"
                      />
                    </div>

                    <div>
                      <strong>{candidate.name}</strong>
                      <small>{candidate.email}</small>
                    </div>

                    <span>{candidate.role}</span>

                    <strong
                      className={`match-score ${
                        candidate.match >= 90
                          ? 'high-score'
                          : candidate.match >= 75
                          ? 'mid-score'
                          : 'low-score'
                      }`}
                    >
                      {candidate.match}%
                    </strong>

          <StatusBadge status={candidate.status} />

                    <div className="candidate-row-actions">
                      <Button
                        className="btn-view"
                        onClick={() => handleOpenDetails(candidate)}
                        title="View Candidate Details"
                      >
                        View
                      </Button>

                      {candidate.status !== 'Shortlisted' && (
                        <Button className="btn-shortlist" onClick={(e) => handleShortlist(candidate.id, e)} title="Shortlist Candidate">Shortlist</Button>
                      )}

                      {candidate.status !== 'Rejected' && (
                        <Button className="btn-reject" onClick={(e) => handleReject(candidate.id, e)} title="Reject Candidate">Reject</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* MODAL 1: Candidate Details View */}
        {viewCandidate && (
          <div className="recruiter-modal-overlay" onClick={handleCloseDetails}>
            <div
              className="recruiter-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="recruiter-tag">CANDIDATE DETAILS</span>
                  <h2>{viewCandidate.name}</h2>
                  <p>{viewCandidate.email} • {viewCandidate.role}</p>
                </div>
                <Button className="modal-close-btn" onClick={handleCloseDetails}>✕</Button>
              </div>

              <div className="modal-body">
                {/* Score & Status Bar */}
                <div className="modal-score-bar">
                  <div className="modal-score-item">
                    <span>Match Score</span>
                    <strong>{viewCandidate.match}%</strong>
                  </div>
                  <div className="modal-score-item">
                    <span>Current Status</span>
          <StatusBadge status={viewCandidate.status} />
                  </div>
                  <div className="modal-score-actions">
                    <Button className="btn-shortlist" disabled={viewCandidate.status === 'Shortlisted'} onClick={() => handleShortlist(viewCandidate.id)}>✓ Shortlist</Button>
                    <Button className="btn-reject" disabled={viewCandidate.status === 'Rejected'} onClick={() => handleReject(viewCandidate.id)}>✕ Reject</Button>
                  </div>
                </div>

                {/* Skills Breakdown */}
                <div className="modal-section">
                  <h3>Matched Skills</h3>
                  <div className="skill-pills-container">
                    {viewCandidate.skills.map((skill) => (
                      <span key={skill} className="skill-pill matched">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {viewCandidate.missingSkills.length > 0 && (
                  <div className="modal-section">
                    <h3>Missing Skills</h3>
                    <div className="skill-pills-container">
                      {viewCandidate.missingSkills.map((skill) => (
                        <span key={skill} className="skill-pill missing">
                          ⚠ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience & Education */}
                <div className="modal-section">
                  <h3>Experience</h3>
                  <p>{viewCandidate.experience}</p>
                </div>

                <div className="modal-section">
                  <h3>Education</h3>
                  <p>{viewCandidate.education}</p>
                </div>

                {/* Recruiter Feedback Form */}
                <div className="modal-section feedback-form-section">
                  <h3>Recruiter Evaluation & Feedback</h3>

                  {feedbackSaved && (
                    <div className="feedback-saved-alert">
                      ✓ Feedback and rating saved successfully!
                    </div>
                  )}

                  <form onSubmit={handleSaveFeedback}>
                    <div className="form-row">
                      <label>Rating:</label>
                      <select
                        value={ratingInput}
                        onChange={(e) => setRatingInput(e.target.value)}
                        className="rating-select"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                        <option value="4">⭐⭐⭐⭐ (4 - Strong Match)</option>
                        <option value="3">⭐⭐⭐ (3 - Average Match)</option>
                        <option value="2">⭐⭐ (2 - Below Requirement)</option>
                        <option value="1">⭐ (1 - Unsuitable)</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <label>Interview Notes / Feedback:</label>
                      <textarea
                        rows="3"
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                        placeholder="Add notes on communication, technical strengths, or hiring team remarks..."
                        className="feedback-textarea"
                      />
                    </div>

                    <Button type="submit" className="save-feedback-btn">Save Feedback</Button>
                  </form>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-close" onClick={handleCloseDetails}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: Candidate Comparison View */}
        {showCompareModal && (
          <div
            className="recruiter-modal-overlay"
            onClick={() => setShowCompareModal(false)}
          >
            <div
              className="recruiter-modal-content compare-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="recruiter-tag">SIDE-BY-SIDE EVALUATION</span>
                  <h2>Candidate Comparison</h2>
                  <p>Comparing {selectedCandidatesForCompare.length} candidates</p>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowCompareModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="modal-body comparison-modal-body">
                <div className="comparison-grid">
                  {selectedCandidatesForCompare.map((c) => (
                    <div key={c.id} className="comparison-column-card">
                      <div className="compare-card-header">
                        <h3>{c.name}</h3>
                        <p>{c.role}</p>
                        <small>{c.email}</small>
                        <div className="compare-score-badge">
                          <strong>{c.match}%</strong> Match
                        </div>
                      </div>

                      <div className="compare-metric-row">
                        <strong>Status:</strong>
          <StatusBadge status={c.status} />
                      </div>

                      <div className="compare-metric-row">
                        <strong>Matched Skills ({c.skills.length}):</strong>
                        <div className="skill-pills-container">
                          {c.skills.map((s) => (
                            <span key={s} className="skill-pill matched">
                              ✓ {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="compare-metric-row">
                        <strong>Missing Skills ({c.missingSkills.length}):</strong>
                        {c.missingSkills.length > 0 ? (
                          <div className="skill-pills-container">
                            {c.missingSkills.map((s) => (
                              <span key={s} className="skill-pill missing">
                                ⚠ {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="no-missing">All skills matched!</p>
                        )}
                      </div>

                      <div className="compare-metric-row">
                        <strong>Experience:</strong>
                        <p>{c.experience}</p>
                      </div>

                      <div className="compare-metric-row">
                        <strong>Education:</strong>
                        <p>{c.education}</p>
                      </div>

                      <div className="compare-metric-row">
                        <strong>Rating:</strong>
                        <span>{'⭐'.repeat(c.rating || 3)}</span>
                      </div>

                      <div className="compare-card-actions">
                        <button
                          className="btn-shortlist"
                          disabled={c.status === 'Shortlisted'}
                          onClick={() => handleShortlist(c.id)}
                        >
                          Shortlist
                        </button>
                        <button
                          className="btn-reject"
                          disabled={c.status === 'Rejected'}
                          onClick={() => handleReject(c.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn-close"
                  onClick={() => setShowCompareModal(false)}
                >
                  Close Comparison
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Card>
  )
}

export default Recruiter