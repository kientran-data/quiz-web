import React from 'react';
import './ResultScreen.css';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round(totalQuestions > 0 ? (score / totalQuestions) * 100 : 0);
  const isPassed = percentage >= 70;
  
  // Calculate SVG stroke offset for the circular gauge (circumference = 440)
  const strokeDashoffset = 440 - (440 * percentage) / 100;

  return (
    <div className="result-container blueprint-bg">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-logo bg-emerald">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title">
                <span>Antigravity Engineering Training</span>
              </div>
              <p className="brand-subtitle text-emerald">Assessment Results</p>
            </div>
          </div>
        </div>
      </header>

      <main className="result-main">
        <div className="result-card">
          {/* Top Banner */}
          <div className="result-banner">
            <div className="banner-left">
              <div className="success-icon">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="banner-text">
                <div className="banner-title">
                  <h1>Assessment Completed</h1>
                  <span className={`status-pill ${isPassed ? 'passed' : 'failed'}`}>
                    {isPassed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <p className="banner-subtitle">
                  {totalQuestions} Questions evaluated
                </p>
              </div>
            </div>
            <div className="banner-right hidden-mobile">
              <div className="evaluation-tier">
                <div className="tier-label">Evaluation Tier</div>
                <div className="tier-value">{isPassed ? 'BENCHMARK MET' : 'NEEDS REVIEW'}</div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="result-body">
            <section className="performance-summary">
              {/* Radial Gauge */}
              <div className="radial-visual">
                <div className="radial-wrapper">
                  <svg className="radial-svg" viewBox="0 0 160 160">
                    <circle className="progress-circle-bg" cx="80" cy="80" r="70"></circle>
                    <circle 
                      className={`progress-circle-meter ${isPassed ? 'meter-passed' : 'meter-failed'}`}
                      cx="80" 
                      cy="80" 
                      r="70" 
                      style={{ strokeDashoffset }}
                    ></circle>
                  </svg>
                  <div className="radial-center">
                    <span className="radial-percent">{percentage}<span className="percent-sign">%</span></span>
                    <span className="radial-fraction">{score} / {totalQuestions} Correct</span>
                  </div>
                </div>
                <span className="proficiency-badge">
                  {isPassed ? 'Proficient Level' : 'Development Needed'}
                </span>
              </div>

              {/* Metric Tiles */}
              <div className="metric-tiles">
                <div className="metric-tile">
                  <div className="metric-header">
                    <span>Final Score</span>
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="metric-value">{score} / {totalQuestions}</div>
                  <div className="metric-sub">Threshold: 70% min</div>
                </div>
                <div className="metric-tile">
                  <div className="metric-header">
                    <span>Status</span>
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div className={`metric-value ${isPassed ? 'text-emerald' : 'text-amber'}`}>
                    {isPassed ? 'Certified' : 'Incomplete'}
                  </div>
                  <div className="metric-sub">Synced to LMS Ledger</div>
                </div>
              </div>
            </section>
          </div>

          {/* Action Bar */}
          <div className="result-actions">
            <button className="btn-secondary" type="button" onClick={onRestart}>
              Retake Assessment
            </button>
            <button className="btn-primary" type="button" onClick={() => window.location.hash = '#admin'}>
              View Global Dashboard
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
