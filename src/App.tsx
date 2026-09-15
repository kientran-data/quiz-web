
import { useQuiz } from './hooks/useQuiz';
import { StartScreen } from './components/StartScreen/StartScreen';
import { QuestionCard } from './components/QuestionCard/QuestionCard';
import { ResultScreen } from './components/ResultScreen/ResultScreen';
import { Admin } from './components/Admin/Admin';
import { useEffect, useState } from 'react';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkHash = () => setIsAdmin(window.location.hash === '#admin');
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const {
    status,
    totalQuestions,
    currentQuestionIndex,
    currentQuestion,
    userAnswers,
    isLastQuestion,
    score,
    startQuiz,
    selectAnswer,
    nextQuestion,
    restartQuiz,
  } = useQuiz();

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <>
      {status === 'idle' && (
        <StartScreen 
          onStart={startQuiz} 
          totalQuestions={totalQuestions} 
        />
      )}

      {status === 'active' && currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          selectedAnswerIndex={userAnswers[currentQuestionIndex]}
          onSelectAnswer={selectAnswer}
          onNext={nextQuestion}
          isLastQuestion={isLastQuestion}
        />
      )}

      {status === 'finished' && (
        <ResultScreen
          score={score}
          totalQuestions={totalQuestions}
          onRestart={restartQuiz}
        />
      )}
    </>
  );
}

export default App;
