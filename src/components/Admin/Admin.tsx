import React, { useEffect, useState } from 'react';
import './Admin.css';

interface Attempt {
  id: number;
  name: string;
  email: string;
  started_at: string;
  submitted_at: string | null;
  elapsed_seconds: number | null;
  score: number | null;
  status: string;
}

export const Admin: React.FC = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [highlightedRowId, setHighlightedRowId] = useState<number | null>(null);

  useEffect(() => {
    // 1. Fetch historical data
    fetch('/api/admin/attempts')
      .then(res => res.json())
      .then(data => {
        setAttempts(data);
        setLoading(false);
      })
      .catch(console.error);

    // 2. Setup Realtime SSE
    const eventSource = new EventSource('/api/admin/events');

    eventSource.onmessage = (event) => {
      try {
        const newAttempt: Attempt = JSON.parse(event.data);
        setAttempts(prev => {
          // Check for duplicate
          const existingIndex = prev.findIndex(a => a.id === newAttempt.id);
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = newAttempt;
            setHighlightedRowId(newAttempt.id);
            setTimeout(() => setHighlightedRowId(null), 3000);
            return updated;
          }
          // Otherwise prepend
          setHighlightedRowId(newAttempt.id);
          setTimeout(() => setHighlightedRowId(null), 3000);
          return [newAttempt, ...prev];
        });
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getStatusBadge = (status: string, score: number | null) => {
    if (status === 'completed' || status === 'submitted') {
      const isPassed = score !== null && score >= 70; // Mock threshold
      if (isPassed) {
        return <span className="badge badge-emerald">Certified</span>;
      }
      return <span className="badge badge-amber">Review Needed</span>;
    }
    return <span className="badge badge-slate">In Progress</span>;
  };

  if (loading) {
    return (
      <div className="admin-container blueprint-bg flex-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-container blueprint-bg">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-logo">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title">
                <span>Admin Console</span>
              </div>
              <p className="brand-subtitle">Training Cohort Results</p>
            </div>
          </div>
          <div className="header-actions hidden-mobile">
            <div className="status-indicator">
              <span className="live-dot"></span>
              <span>Live Sync Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-card">
          <div className="card-header">
            <h2 className="card-title">Assessment Ledger</h2>
            <div className="card-actions">
              <span className="count-badge">{attempts.length} Total</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Candidate</th>
                  <th>Email</th>
                  <th>Started At</th>
                  <th>Status</th>
                  <th className="text-right">Score</th>
                  <th className="text-right">Time (s)</th>
                </tr>
              </thead>
              <tbody>
                {attempts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-state">No assessments found.</td>
                  </tr>
                ) : (
                  attempts.map(a => (
                    <tr key={a.id} className={a.id === highlightedRowId ? 'highlight-row' : ''}>
                      <td className="font-mono text-xs text-slate-400">#{a.id}</td>
                      <td className="font-medium text-slate-200">{a.name}</td>
                      <td className="text-slate-400">{a.email}</td>
                      <td className="font-mono text-xs">{new Date(a.started_at).toLocaleString()}</td>
                      <td>{getStatusBadge(a.status, a.score)}</td>
                      <td className="text-right font-mono font-medium">
                        {a.score !== null ? `${a.score}%` : '-'}
                      </td>
                      <td className="text-right font-mono text-slate-400">
                        {a.elapsed_seconds !== null ? `${a.elapsed_seconds}s` : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
