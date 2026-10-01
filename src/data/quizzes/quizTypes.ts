export interface QuizQuestion {
  id: number;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}
