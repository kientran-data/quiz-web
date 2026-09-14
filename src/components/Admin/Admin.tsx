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

  useEffect(() => {
    fetch('/api/admin/attempts')
      .then(res => res.json())
      .then(data => {
        setAttempts(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div>Loading Admin...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Started At</th>
            <th>Status</th>
            <th>Score</th>
            <th>Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{new Date(a.started_at).toLocaleString()}</td>
              <td>{a.status}</td>
              <td>{a.score !== null ? a.score : '-'}</td>
              <td>{a.elapsed_seconds !== null ? a.elapsed_seconds : '-'}</td>
            </tr>
          ))}
          {attempts.length === 0 && (
            <tr>
              <td colSpan={7}>No attempts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
