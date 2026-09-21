import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

// Static telemetry / model documentation aligned with backend architecture
const SYSTEM_SERVICES = [
  {
    name: 'FastAPI Analysis API',
    endpoint: 'http://127.0.0.1:8000/api/resume/analyze',
    type: 'Core Backend Service',
    description: 'Handles multipart resume uploads and orchestrates parsing and scoring algorithms.'
  },
  {
    name: 'Gemini AI Model Service',
    endpoint: 'Google GenAI SDK (gemini-2.5-flash)',
    type: 'LLM Recommendation Engine',
    description: 'Generates customized career recommendations and skill development suggestions.'
  },
  {
    name: 'Document Parser Engine',
    endpoint: 'pypdf & python-docx',
    type: 'File Text Extraction',
    description: 'Extracts plain text and paragraphs from uploaded .pdf and .docx resume documents.'
  },
  {
    name: 'Client Web Application',
    endpoint: 'http://localhost:5173',
    type: 'React 19 + Vite Frontend',
    description: 'Serves the Candidate, Recruiter, and Admin user interfaces and visualizations.'
  }
]

const MODEL_INFO = {
  name: 'gemini-2.5-flash',
  provider: 'Google GenAI SDK (google-genai 2.22.0)',
  task: 'AI Resume Recommendations & Skill Gap Advisory',
  temperature: 0.7,
  fallbackStrategy: 'Graceful text fallback ("AI recommendations are temporarily unavailable")',
  heuristicsEngine: 'Regex Token Matcher with 36 curated technical domains (SKILLS list)',
  keywordAlgorithm: 'Alphanumeric tokenization with 30+ stopword filter'
}

const HOURLY_ACTIVITY_DATA = [
  { time: '09:00', requests: 4, latency: 280 },
  { time: '10:00', requests: 9, latency: 310 },
  { time: '11:00', requests: 15, latency: 290 },
  { time: '12:00', requests: 12, latency: 340 },
  { time: '13:00', requests: 8, latency: 270 },
  { time: '14:00', requests: 18, latency: 320 },
  { time: '15:00', requests: 22, latency: 300 }
]

const SCORE_DISTRIBUTION_DATA = [
  { name: 'High Match (90-100%)', value: 8, color: '#16a34a' },
  { name: 'Moderate Match (75-89%)', value: 14, color: '#4f46e5' },
  { name: 'Low Match (<75%)', value: 5, color: '#f97316' }
]

const INITIAL_LOGS = [
  { id: 1, time: '12:50:14', level: 'INFO', message: 'FastAPI application startup complete on port 8000.' },
  { id: 2, time: '12:51:02', level: 'SUCCESS', message: 'POST /api/resume/analyze — 200 OK (286ms, jane_doe_resume.docx)' },
  { id: 3, time: '12:52:18', level: 'WARNING', message: 'POST /api/resume/analyze — 422 Unprocessable Entity (Missing resume_file)' },
  { id: 4, time: '12:53:05', level: 'SUCCESS', message: 'GET / — 200 OK (12ms, Health check probe)' },
  { id: 5, time: '12:54:20', level: 'INFO', message: 'CORS origins validated: localhost:5173, localhost:5174, localhost:5175' }
]

function Admin() {
  const [backendStatus, setBackendStatus] = useState({
    checked: false,
    online: false,
    latency: null,
    message: '',
    error: null
  })
  const [loading, setLoading] = useState(true)
  const [errorState, setErrorState] = useState(false)
  const [emptyState, setEmptyState] = useState(false)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'monitoring' | 'model' | 'analytics'
  const [systemLogs] = useState(INITIAL_LOGS)

  // Live Backend Ping to GET http://127.0.0.1:8000/
  const checkBackendHealth = useCallback(async () => {
    setLoading(true)
    setErrorState(false)
    const startTime = performance.now()

    try {
      const response = await fetch('http://127.0.0.1:8000/', {
        method: 'GET'
      })
      const latency = Math.round(performance.now() - startTime)
      const data = await response.json()

      if (response.ok) {
        setBackendStatus({
          checked: true,
          online: true,
          latency,
          message: data.message || 'Running',
          error: null
        })
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (err) {
      const latency = Math.round(performance.now() - startTime)
      setBackendStatus({
        checked: true,
        online: false,
        latency,
        message: 'Backend server is offline or unreachable',
        error: err.message
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let ignore = false
    const startTime = performance.now()

    fetch('http://127.0.0.1:8000/', { method: 'GET' })
      .then((res) => {
        const latency = Math.round(performance.now() - startTime)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json().then((data) => ({ data, latency }))
      })
      .then(({ data, latency }) => {
        if (!ignore) {
          setBackendStatus({
            checked: true,
            online: true,
            latency,
            message: data.message || 'Running',
            error: null
          })
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!ignore) {
          const latency = Math.round(performance.now() - startTime)
          setBackendStatus({
            checked: true,
            online: false,
            latency,
            message: 'Backend server is offline or unreachable',
            error: err.message
          })
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  // Overview statistics
  const metrics = useMemo(() => {
    return {
      totalAnalyses: 88,
      activeUsers: 24,
      avgScore: '83%',
      avgLatency: backendStatus.latency ? `${backendStatus.latency}ms` : '310ms',
      successRate: '98.8%',
      systemStatus: backendStatus.online ? 'Healthy' : 'Degraded'
    }
  }, [backendStatus])

  return (
    <div className="admin-page riq-page">
      {/* Navbar */}
      <nav className="admin-navbar riq-nav">
        <div className="logo">
          Resume<span>IQ</span>
          <span className="admin-pill">ADMIN</span>
        </div>

        <div className="admin-nav-links">
          <Link to="/">Home</Link>
          <Link to="/upload">Candidate</Link>
          <Link to="/recruiter">Recruiter</Link>
          <span className="active">Admin</span>
        </div>
      </nav>

      <main className="admin-content riq-container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <p className="riq-eyebrow">SYSTEM ADMINISTRATION</p>
            <h1>Platform Operations & Monitoring</h1>
            <p className="riq-subtitle">
              Inspect backend service health, AI model status, deployment parameters, and platform traffic.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              className="admin-refresh-btn"
              onClick={checkBackendHealth}
              disabled={loading}
              title="Ping Backend Service"
            >
              {loading ? 'Pinging...' : '⚡ Re-check API Health'}
            </button>

            {/* Simulated state toggle buttons for testing verification */}
            <button
              className="admin-toggle-state-btn"
              onClick={() => setErrorState(!errorState)}
              title="Toggle simulated error state"
            >
              {errorState ? 'Clear Error' : 'Simulate Error'}
            </button>

            <button
              className="admin-toggle-state-btn"
              onClick={() => setEmptyState(!emptyState)}
              title="Toggle simulated empty state"
            >
              {emptyState ? 'Restore Data' : 'Simulate Empty'}
            </button>
          </div>
        </div>

        {/* Backend Dependency Transparency Banner */}
        <div className="admin-notice-banner">
          <div>
            <strong>ℹ️ Architecture & Integration Notice:</strong> Live backend health check is dynamically integrated via{' '}
            <code>GET http://127.0.0.1:8000/</code>. Persistent telemetry, automated database log aggregation, and real-time model retraining tracking require Backend Admin APIs (Member 2 / Member 3 responsibility).
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 System Overview
          </button>
          <button
            className={`admin-tab ${activeTab === 'monitoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoring')}
          >
            🩺 Service Monitoring
          </button>
          <button
            className={`admin-tab ${activeTab === 'model' ? 'active' : ''}`}
            onClick={() => setActiveTab('model')}
          >
            🤖 AI Model & Heuristics
          </button>
          <button
            className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Traffic & Latency
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="admin-loading-state">
            <div className="admin-spinner"></div>
            <h3>Loading Admin Data...</h3>
            <p>Pinging backend services and aggregating metrics.</p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && errorState && (
          <div className="admin-error-state">
            <div className="error-icon">⚠️</div>
            <h3>Unable to Load Admin Data</h3>
            <p>Failed to establish connection to the administration telemetry pipeline.</p>
            <button className="admin-retry-btn" onClick={() => setErrorState(false)}>
              Retry Connection
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !errorState && emptyState && (
          <div className="admin-empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Monitoring Data Available</h3>
            <p>No recent activity logs, model requests, or health records were returned.</p>
            <button className="admin-retry-btn" onClick={() => setEmptyState(false)}>
              Load Sample Telemetry
            </button>
          </div>
        )}

        {/* NORMAL VIEW */}
        {!loading && !errorState && !emptyState && (
          <>
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="admin-tab-content">
                {/* Metric Summary Cards */}
                <section className="admin-stats-grid">
                  <div className="admin-stat-card">
                    <span className="card-label">Backend API Status</span>
                    <div className="stat-with-badge">
                      <strong>{backendStatus.online ? 'Online' : 'Offline'}</strong>
                      <span className={`status-pill ${backendStatus.online ? 'healthy' : 'degraded'}`}>
                        {backendStatus.online ? '● 200 OK' : '● Disconnected'}
                      </span>
                    </div>
                    <small>Live probe: {backendStatus.latency ? `${backendStatus.latency}ms latency` : 'Checking...'}</small>
                  </div>

                  <div className="admin-stat-card">
                    <span className="card-label">Total Resumes Analyzed</span>
                    <strong>{metrics.totalAnalyses}</strong>
                    <small>Across PDF and DOCX uploads</small>
                  </div>

                  <div className="admin-stat-card">
                    <span className="card-label">Overall Success Rate</span>
                    <strong>{metrics.successRate}</strong>
                    <small>Completed analyses without fatal error</small>
                  </div>

                  <div className="admin-stat-card">
                    <span className="card-label">Average Match Score</span>
                    <strong>{metrics.avgScore}</strong>
                    <small>Mean compatibility rating</small>
                  </div>
                </section>

                {/* Quick Service Status Overview */}
                <section className="admin-section">
                  <h2>Service Health Summary</h2>
                  <div className="services-list-grid">
                    {SYSTEM_SERVICES.map((srv) => (
                      <div key={srv.name} className="service-card">
                        <div className="service-card-header">
                          <div>
                            <h3>{srv.name}</h3>
                            <span className="service-type">{srv.type}</span>
                          </div>
                          <span
                            className={`status-pill ${
                              srv.name.includes('FastAPI')
                                ? backendStatus.online
                                  ? 'healthy'
                                  : 'degraded'
                                : 'healthy'
                            }`}
                          >
                            {srv.name.includes('FastAPI')
                              ? backendStatus.online
                                ? '● Active'
                                : '● Offline'
                              : '● Ready'}
                          </span>
                        </div>
                        <p>{srv.description}</p>
                        <code>{srv.endpoint}</code>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* TAB 2: SYSTEM MONITORING */}
            {activeTab === 'monitoring' && (
              <div className="admin-tab-content">
                <section className="admin-section">
                  <div className="section-title-row">
                    <h2>Live Probe & Service Verification</h2>
                    <button className="admin-refresh-btn" onClick={checkBackendHealth}>
                      ↻ Re-ping Probe
                    </button>
                  </div>

                  <div className="probe-result-box">
                    <div className="probe-metric">
                      <span>Target Endpoint:</span>
                      <code>GET http://127.0.0.1:8000/</code>
                    </div>
                    <div className="probe-metric">
                      <span>Health Check Result:</span>
                      <strong className={backendStatus.online ? 'text-healthy' : 'text-danger'}>
                        {backendStatus.online ? '✓ 200 OK — Operational' : '✕ Connection Refused / Offline'}
                      </strong>
                    </div>
                    <div className="probe-metric">
                      <span>Server Message:</span>
                      <span>{backendStatus.message || 'No response message'}</span>
                    </div>
                    <div className="probe-metric">
                      <span>Roundtrip Latency:</span>
                      <span>{backendStatus.latency ? `${backendStatus.latency} ms` : 'N/A'}</span>
                    </div>
                  </div>
                </section>

                {/* System Activity Logs Table */}
                <section className="admin-section">
                  <h2>Recent System Activity Logs</h2>
                  <div className="table-responsive-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Timestamp</th>
                          <th>Level</th>
                          <th>Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {systemLogs.map((log) => (
                          <tr key={log.id}>
                            <td><code>{log.time}</code></td>
                            <td>
                              <span className={`log-badge ${log.level.toLowerCase()}`}>
                                {log.level}
                              </span>
                            </td>
                            <td>{log.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 3: MODEL INFORMATION */}
            {activeTab === 'model' && (
              <div className="admin-tab-content">
                <section className="admin-section">
                  <h2>AI & Heuristic Engines</h2>
                  <div className="model-details-card">
                    <div className="model-header-row">
                      <div>
                        <h3>{MODEL_INFO.name}</h3>
                        <p className="model-provider">{MODEL_INFO.provider}</p>
                      </div>
                      <span className="status-pill healthy">● Integrated in ai_service.py</span>
                    </div>

                    <div className="model-spec-grid">
                      <div className="spec-item">
                        <strong>Task Responsibility:</strong>
                        <p>{MODEL_INFO.task}</p>
                      </div>
                      <div className="spec-item">
                        <strong>Temperature Setting:</strong>
                        <p>{MODEL_INFO.temperature} (Balanced analytical creativity)</p>
                      </div>
                      <div className="spec-item">
                        <strong>Fault-Tolerance Strategy:</strong>
                        <p>{MODEL_INFO.fallbackStrategy}</p>
                      </div>
                      <div className="spec-item">
                        <strong>NLP Heuristic Engine:</strong>
                        <p>{MODEL_INFO.heuristicsEngine}</p>
                      </div>
                      <div className="spec-item">
                        <strong>Keyword Extraction:</strong>
                        <p>{MODEL_INFO.keywordAlgorithm}</p>
                      </div>
                      <div className="spec-item">
                        <strong>Document Parser Library:</strong>
                        <p>PyPDF 6.16 (PDF) & python-docx 1.2 (DOCX)</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* TAB 4: ANALYTICS & TRAFFIC */}
            {activeTab === 'analytics' && (
              <div className="admin-tab-content">
                <section className="admin-charts-grid">
                  {/* Analysis Volume BarChart */}
                  <div className="admin-chart-card">
                    <h3>Hourly Analysis Requests</h3>
                    <p>Number of resume evaluation calls per hour</p>
                    <div className="admin-chart-container">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={HOURLY_ACTIVITY_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="requests" name="Requests" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Latency LineChart */}
                  <div className="admin-chart-card">
                    <h3>Average Processing Latency (ms)</h3>
                    <p>End-to-end parsing & scoring duration</p>
                    <div className="admin-chart-container">
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={HOURLY_ACTIVITY_DATA}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis domain={[200, 400]} />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="latency"
                            name="Latency (ms)"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Match Score Distribution PieChart */}
                  <div className="admin-chart-card full-width">
                    <h3>Candidate Match Score Distribution</h3>
                    <p>Classification of processed resumes across tiers</p>
                    <div className="admin-chart-container">
                      <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                          <Pie
                            data={SCORE_DISTRIBUTION_DATA}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={85}
                            label
                          >
                            {SCORE_DISTRIBUTION_DATA.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Admin
