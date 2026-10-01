import type { QuizQuestion } from './quizTypes';
import { pythonQuiz } from './python';
import { sqlQuiz } from './sql';
import { mlQuiz } from './ml';
import { tensorflowQuiz } from './tensorflow';
import { powerbiQuiz } from './powerbi';
import { javaQuiz } from './java';

export type { QuizQuestion };

export const quizBank: Record<string, QuizQuestion[]> = {
  Python: pythonQuiz,
  SQL: sqlQuiz,
  'Machine Learning': mlQuiz,
  TensorFlow: tensorflowQuiz,
  'Power BI': powerbiQuiz,
  Java: javaQuiz,
};

export const quizSkills = Object.keys(quizBank);

const answerLetters = ['A', 'B', 'C', 'D'] as const;

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function generateQuiz(skill: string): QuizQuestion[] {
  const bank = quizBank[skill] || quizBank.Python;

  return shuffled(bank).map((question) => {
    const options = shuffled(question.options.map((text, index) => ({
      text,
      isCorrect: answerLetters[index] === question.correctAnswer,
    })));

    return {
      ...question,
      options: options.map((option) => option.text),
      correctAnswer: answerLetters[options.findIndex((option) => option.isCorrect)],
    };
  });
}
