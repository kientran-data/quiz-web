import { useState, useEffect } from 'react';
import type { Question, QuizStatus } from '../types';

export function useQuiz() {
  const [status, setStatus] = useState<QuizStatus>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [attemptId, setAttemptId] = useState<number | null>(null);

  // Initial load
  useEffect(() => {
    // 1. Fetch config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.questions_per_attempt) {
          setTotalQuestions(data.questions_per_attempt);
        }
      })
      .catch(console.error);

    // 2. Resume attempt if exists
    const savedAttempt = localStorage.getItem('quiz_attempt_id');
    if (savedAttempt) {
      fetch(`/api/attempts/${savedAttempt}`)
        .then(res => {
          if (!res.ok) throw new Error('Attempt not found');
          return res.json();
        })
        .then(data => {
          setAttemptId(data.attempt_id);
          setQuestions(data.questions);
          setTotalQuestions(data.questions.length);
          
          if (data.status === 'completed') {
            setScore(data.score);
            setStatus('finished');
          } else {
            // Restore partial state if possible, though for simplicity we reset to Q1
            setUserAnswers(new Array(data.questions.length).fill(-1));
            setStatus('active');
          }
        })
        .catch(() => {
          localStorage.removeItem('quiz_attempt_id');
        });
    }
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const startQuiz = async (name: string, email: string) => {
    try {
      // 1. Register
      const pRes = await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const participant = await pRes.json();

      // 2. Start
      const aRes = await fetch('/api/attempts/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_id: participant.id })
      });
      const attempt = await aRes.json();

      setAttemptId(attempt.attempt_id);
      localStorage.setItem('quiz_attempt_id', attempt.attempt_id.toString());
      setQuestions(attempt.questions);
      setTotalQuestions(attempt.questions.length);
      setUserAnswers(new Array(attempt.questions.length).fill(-1));
      setCurrentQuestionIndex(0);
      setStatus('active');
    } catch (err) {
      console.error('Failed to start quiz:', err);
      alert('Failed to start quiz. Please try again.');
    }
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = async () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Submit
      if (!attemptId) return;
      try {
        const payload = {
          answers: userAnswers.map((ans, idx) => ({
            questionId: questions[idx].id,
            selectedOptionIndex: ans
          }))
        };
        
        const res = await fetch(`/api/attempts/${attemptId}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.error) throw new Error(data.error);
        
        setScore(data.score);
        setStatus('finished');
      } catch (err) {
        console.error('Failed to submit:', err);
        alert('Failed to submit quiz.');
      }
    }
  };

  const restartQuiz = () => {
    localStorage.removeItem('quiz_attempt_id');
    setAttemptId(null);
    setQuestions([]);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    setStatus('idle');
  };

  return {
    status,
    questions,
    totalQuestions, // Exposing totalQuestions since questions array might be empty initially
    currentQuestionIndex,
    currentQuestion,
    userAnswers,
    isLastQuestion,
    score,
    startQuiz,
    selectAnswer,
    nextQuestion,
    restartQuiz,
  };
}
