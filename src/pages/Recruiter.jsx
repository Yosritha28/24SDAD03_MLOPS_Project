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

const candidateMatchData = [
  {
    candidate: 'Candidate 01',
    match: 92
  },
  {
    candidate: 'Candidate 02',
    match: 86
  },
  {
    candidate: 'Candidate 03',
    match: 74
  }
]

const candidateStatusData = [
  {
    name: 'Shortlisted',
    value: 8
  },
  {
    name: 'Under Review',
    value: 10
  },
  {
    name: 'Pending',
    value: 6
  }
]

function Recruiter() {
  return (
    <div className="recruiter-page">

      {/* Navbar */}
      <nav className="recruiter-navbar">

        <div className="logo">
          Resume<span>IQ</span>
        </div>

        <div className="recruiter-nav-links">
          <Link to="/">Home</Link>
          <Link to="/upload">Candidate</Link>
          <span className="active">Recruiter</span>
        </div>

      </nav>

      <main className="recruiter-content">

        {/* Header */}
        <div className="recruiter-header">

          <div>
            <p className="recruiter-tag">
              RECRUITER PORTAL
            </p>

            <h1>
              Find the right talent faster.
            </h1>

            <p>
              Review candidate profiles, compare job compatibility,
              and identify the strongest candidates with ResumeIQ.
            </p>
          </div>

          <button className="add-job-btn">
            + Add Job
          </button>

        </div>

        {/* Statistics */}
        <section className="recruiter-stats">

          <div className="stat-card">
            <span>Total Candidates</span>
            <strong>24</strong>
          </div>

          <div className="stat-card">
            <span>Jobs Posted</span>
            <strong>6</strong>
          </div>

          <div className="stat-card">
            <span>Shortlisted</span>
            <strong>8</strong>
          </div>

          <div className="stat-card">
            <span>Average Match</span>
            <strong>78%</strong>
          </div>

        </section>

        {/* Analytics */}
        <section className="analytics-section">

          <div className="analytics-header">
            <div>
              <p className="recruiter-tag">
                RECRUITMENT ANALYTICS
              </p>

              <h2>
                Candidate Insights
              </h2>

              <p>
                Visual overview of candidate compatibility and status.
              </p>
            </div>
          </div>

          <div className="charts-grid">

            {/* Match Score Chart */}
            <div className="chart-card">

              <div className="chart-card-header">
                <h3>Candidate Match Scores</h3>

                <p>
                  Resume compatibility by candidate
                </p>
              </div>

              <div className="chart-container">

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={candidateMatchData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="candidate"
                    />

                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />

                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Match']}
                    />

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

                <p>
                  Current recruitment pipeline
                </p>
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
                            ['#4f46e5', '#f97316', '#9ca3af'][index]
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

        {/* Candidate Overview */}
        <section className="candidate-section">

          <div className="section-heading">

            <div>
              <h2>
                Candidate Overview
              </h2>

              <p>
                Review candidates based on resume compatibility.
              </p>
            </div>

            <button className="filter-btn">
              Filter
            </button>

          </div>

          <div className="candidate-table">

            <div className="table-header">
              <span>Candidate</span>
              <span>Role</span>
              <span>Match</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {/* Candidate 01 */}
            <div className="candidate-row">

              <div>
                <strong>Candidate 01</strong>
                <small>candidate01@email.com</small>
              </div>

              <span>
                Software Engineer
              </span>

              <strong className="match-score">
                92%
              </strong>

              <span className="status shortlisted">
                Shortlisted
              </span>

              <button>
                View
              </button>

            </div>

            {/* Candidate 02 */}
            <div className="candidate-row">

              <div>
                <strong>Candidate 02</strong>
                <small>candidate02@email.com</small>
              </div>

              <span>
                Backend Developer
              </span>

              <strong className="match-score">
                86%
              </strong>

              <span className="status review">
                Under Review
              </span>

              <button>
                View
              </button>

            </div>

            {/* Candidate 03 */}
            <div className="candidate-row">

              <div>
                <strong>Candidate 03</strong>
                <small>candidate03@email.com</small>
              </div>

              <span>
                Full Stack Developer
              </span>

              <strong className="match-score">
                74%
              </strong>

              <span className="status pending">
                Pending
              </span>

              <button>
                View
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Recruiter