import React from 'react';
import type { Question } from '../../types';
import { Button } from '../Button/Button';
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
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
        <div 
          className="progress-bar-track" 
          role="progressbar" 
          aria-valuenow={progressPercentage} 
          aria-valuemin={0} 
          aria-valuemax={100}
        >
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </div>
      </div>
      <h2 className="question-text">{question.text}</h2>
      
      <div className="options-list">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswerIndex === index ? 'primary' : 'secondary'}
            fullWidth
            onClick={() => onSelectAnswer(index)}
            className="option-button"
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="question-footer">
        <Button 
          variant="primary" 
          onClick={onNext} 
          disabled={selectedAnswerIndex === -1}
        >
          {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};
