export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export type QuizStatus = 'idle' | 'active' | 'finished';
