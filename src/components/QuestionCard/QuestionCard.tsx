import React from 'react';
import type { Question } from '../../types';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswerIndex: number;
  onSelectAnswer: (index: number) => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswerIndex,
  onSelectAnswer,
  onNext,
  isLastQuestion,
}) => {
  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="quiz-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-logo">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div className="brand-text">
              <div className="brand-title">
                <span>Antigravity Engineering</span>
                <span className="dot hidden-mobile">•</span>
                <span className="module-badge">Module 02</span>
              </div>
              <p className="brand-subtitle">Distributed Systems &amp; Consensus Architecture</p>
            </div>
          </div>
          
          <div className="header-actions">
            <div className="timer-badge">
              <svg className="timer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                <polyline points="12 6 12 12 16 14" strokeWidth="2"></polyline>
              </svg>
              <span>18:42</span>
            </div>
            <button className="exit-btn" title="Progress is automatically synced">
              Save &amp; Exit
            </button>
          </div>
        </div>
      </header>

      <main className="quiz-main">
        <section className="progress-section">
          <div className="progress-header">
            <div className="progress-info">
              <span className="question-count">Question {(currentQuestionIndex + 1).toString().padStart(2, '0')} of {totalQuestions}</span>
            </div>
            <span className="progress-percent">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </section>

        <article className="question-card">
          <div className="card-glow" aria-hidden="true"></div>
          
          <div className="question-meta">
            <span className="category-badge">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              System Design &amp; Resiliency
            </span>
          </div>
          
          <h1 className="question-title">{question.text}</h1>

          <form className="options-form" onSubmit={(e) => e.preventDefault()}>
            <fieldset>
              <legend className="sr-only">Choose one answer option</legend>
              {question.options.map((option, index) => {
                const isSelected = selectedAnswerIndex === index;
                return (
                  <label key={index} className={`option-label ${isSelected ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name={`question_${question.id}`} 
                      value={index}
                      checked={isSelected}
                      onChange={() => onSelectAnswer(index)}
                      className="sr-only"
                    />
                    <span className="option-key">{LETTERS[index] || index + 1}</span>
                    <div className="option-content">
                      <span className="option-text">{option}</span>
                    </div>
                    <span className="option-indicator">
                      {isSelected && (
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </form>

          <footer className="card-footer">
            <button className="btn-secondary" type="button" disabled>
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Previous Question
            </button>
            <div className="footer-right">
              <button className="btn-primary" type="button" onClick={onNext} disabled={selectedAnswerIndex === -1}>
                {isLastQuestion ? 'Submit Assessment' : 'Next Question'}
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
};
