import React from 'react';
import { Button } from '../Button/Button';
import './ResultScreen.css';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  return (
    <div className="result-screen">
      <h1>Quiz Complete!</h1>
      
      <div className="score-container">
        <div className="score-circle">
          <span className="score-number">{score}</span>
          <span className="score-divider">/</span>
          <span className="score-total">{totalQuestions}</span>
        </div>
        <p className="score-percentage">{percentage}% Score</p>
      </div>

      <div className="result-action">
        <Button onClick={onRestart} variant="outline" fullWidth>
          Restart Quiz
        </Button>
      </div>
    </div>
  );
};
