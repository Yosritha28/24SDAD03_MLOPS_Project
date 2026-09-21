import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';

// Frontend persistence layer for candidate application tracking (Step 2).
// Single storage key for all applications.
const STORAGE_KEY = 'resumeiq_applications';

// Temporary application data – used as initial seed when localStorage is empty
const mockApplications = [
  {
    id: 1,
    jobRole: 'Frontend Engineer',
    company: 'TechCorp',
    date: '2024-08-12',
    matchScore: 87,
    status: 'Applied',
    details: {
      description: 'Develop and maintain the web UI for the main product.',
      notes: 'Submitted via company portal.',
    },
  },
  {
    id: 2,
    jobRole: 'Full-Stack Developer',
    company: 'InnovateX',
    date: '2024-09-01',
    matchScore: 92,
    status: 'Under Review',
    details: {
      description: 'Work on both frontend and backend services.',
      notes: 'HR reviewing application.',
    },
  },
  {
    id: 3,
    jobRole: 'UI/UX Designer',
    company: 'Creative Labs',
    date: '2024-07-20',
    matchScore: null,
    status: 'Shortlisted',
    details: {
      description: 'Design user interfaces for mobile apps.',
      notes: 'Shortlisted for interview next week.',
    },
  },
  {
    id: 4,
    jobRole: 'Data Analyst',
    company: null,
    date: '2024-06-15',
    matchScore: 78,
    status: 'Rejected',
    details: {
      description: 'Analyze data trends for the marketing team.',
      notes: 'Position filled.',
    },
  },
];

// Read persisted applications safely.
// Returns the stored array when valid, otherwise the existing mock seed data.
function loadApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Invalid JSON or storage unavailable: fall through to seed data.
  }
  return mockApplications;
}

// Persist applications safely without crashing the page.
function saveApplications(applications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch {
    // Storage quota/unavailable: keep in-memory state only.
  }
}

// Helper component for the status tracker visualisation
function StatusTracker({ current }) {
  const steps = ['Applied', 'Under Review', 'Shortlisted', 'Rejected'];

  return (
    <div
      className="status-tracker"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {steps.map((step, idx) => {
        const isActive = step === current;
        const isCompleted =
          steps.indexOf(current) > idx ||
          (current === 'Rejected' && step !== 'Shortlisted');

        const symbol = isCompleted ? '✓' : isActive ? '●' : '○';

        return (
          <React.Fragment key={step}>
            <span style={{ fontWeight: isActive ? '600' : '400' }}>
              {symbol} {step}
            </span>

            {idx < steps.length - 1 && <span>→</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  // Load persisted applications on first mount.
  // Seeds localStorage with existing mock data only when nothing valid is stored.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const loaded = loadApplications();
        setApplications(loaded);
        try {
          if (!localStorage.getItem(STORAGE_KEY)) {
            saveApplications(loaded);
          }
        } catch {
          // Ignore seed-save errors; in-memory data is already displayed.
        }
        setLoading(false);
      } catch {
        setError('Unable to load applications.');
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const filtered = applications.filter((app) => {
    if (filter === 'All') return true;
    return app.status === filter;
  });

  const statusOptions = [
    'All',
    'Applied',
    'Under Review',
    'Shortlisted',
    'Rejected',
  ];

  // Loading state
  if (loading) {
    return (
      <div className="applications-page riq-page riq-narrow">
        <p className="riq-eyebrow">CANDIDATE TRACKING</p>
        <h2>My Applications</h2>
        <LoadingState message="Loading applications..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="applications-page riq-page riq-narrow">
        <p className="riq-eyebrow">CANDIDATE TRACKING</p>
        <h2>My Applications</h2>

        <ErrorState
          title="Error"
          message={error}
          onRetry={() => window.location.reload()}
          retryLabel="Retry"
        />
      </div>
    );
  }

  // Empty state
  if (filtered.length === 0) {
    return (
      <div className="applications-page riq-page riq-narrow">
        <p className="riq-eyebrow">CANDIDATE TRACKING</p>
        <h2>My Applications</h2>

        <EmptyState
          title="No applications found."
          actionLabel="Analyze Resume"
          onAction={() => navigate('/upload')}
        />
      </div>
    );
  }

  return (
    <div className="applications-page riq-page">
      <div className="riq-container">
        <p className="riq-eyebrow">CANDIDATE TRACKING</p>
        <h2>My Applications</h2>
        <p className="riq-subtitle">
          Every analyzed resume is saved here automatically.
        </p>

        {/* Filter buttons */}
        <div
          className="filter-toolbar riq-filters"
        >
          {statusOptions.map((opt) => (
            <Button
              key={opt}
              className={`filter-btn ${filter === opt ? 'active' : ''}`}
              onClick={() => setFilter(opt)}
            >
              {opt}
            </Button>
          ))}
        </div>

        {/* Application cards */}
        <div className="applications-card-list">
          {filtered.map((app) => (
            <article key={app.id} className="application-card">
              <div className="application-main">
                <h3>{app.jobRole}</h3>
                <p className="application-company">{app.company ?? '—'}</p>
                <p className="application-meta">
                  <StatusBadge status={app.status} />{' '}
                  <span>
                    {app.date
                      ? new Date(app.date).toLocaleDateString()
                      : '—'}
                  </span>
                </p>
              </div>

              <div className="application-side">
                <strong className="application-score">
                  {app.matchScore !== null && app.matchScore !== undefined
                    ? `${app.matchScore}% MATCH`
                    : 'NO SCORE'}
                </strong>
                <Button
                  className="view-details-btn"
                  onClick={() => setSelected(app)}
                >
                  View Details
                </Button>
              </div>
            </article>
          ))}
        </div>

      {/* Details modal */}
      {selected && (
        <Modal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          title={`${selected.jobRole} – ${selected.company ?? 'N/A'}`}
          overlayClassName="modal-overlay"
          className="modal-content"
        >
            <p>
              <strong>Date Applied:</strong>{' '}
              {selected.date
                ? new Date(selected.date).toLocaleDateString()
                : '—'}
            </p>

            <p>
              <strong>Status:</strong> {selected.status}
            </p>

            {selected.matchScore !== null && selected.matchScore !== undefined && (
              <p>
                <strong>Match Score:</strong>{' '}
                {selected.matchScore}%
              </p>
            )}

            <p>
              <strong>Description:</strong>{' '}
              {selected.details?.description ?? selected.description ?? '—'}
            </p>

            <p>
              <strong>Notes:</strong>{' '}
              {selected.details?.notes ?? selected.notes ?? '—'}
            </p>

            <h4>Progress</h4>

            <StatusTracker current={selected.status} />

            <div style={{ marginTop: '12px' }}>
              <Button
                className="btn-close"
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
            </div>
        </Modal>
      )}
      </div>
    </div>
  );
}