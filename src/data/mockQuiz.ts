import type { Question } from '../types';

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswerIndex: 2,
  },
  {
    id: 'q2',
    text: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswerIndex: 1,
  },
  {
    id: 'q3',
    text: 'Who wrote "Romeo and Juliet"?',
    options: [
      'Charles Dickens',
      'William Shakespeare',
      'Jane Austen',
      'Mark Twain',
    ],
    correctAnswerIndex: 1,
  },
];
