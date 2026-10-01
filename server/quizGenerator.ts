import type { QuizQuestion } from '../src/data/quizzes/quizTypes';

const MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';
const SKILLS = ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Power BI', 'Java'];
const LETTERS = ['A', 'B', 'C', 'D'] as const;
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export async function generateQuizWithOpenRouter(skill: string, apiKey: string): Promise<QuizQuestion[]> {
  if (!SKILLS.includes(skill)) throw new Error('Unsupported quiz subject');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost',
      'X-Title': 'Next Gen Skill Assessment',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.9,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Create accurate educational multiple-choice assessments. Return only valid JSON.',
        },
        {
          role: 'user',
          content: `Generate exactly 10 distinct ${skill} assessment questions spanning beginner, intermediate, and advanced levels. Return a JSON object with a "questions" array. Each item must have "difficulty" (Beginner, Intermediate, or Advanced), "question", "options" (exactly 4 strings), "correctAnswer" (A, B, C, or D), and "explanation". Ensure the correct answer letter matches the option, avoid duplicates, and make the explanations concise.`,
        },
      ],
    }),
  });

  if (!response.ok) throw new Error(`Quiz generation failed (${response.status})`);

  const payload = await response.json() as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw new Error('Quiz provider returned an invalid response');

  const jsonContent = content.match(/\{[\s\S]*\}/)?.[0] ?? content;
  const normalizedContent = jsonContent
    .replace(/([{,]\s*)([A-Za-z_][\w]*)(\s*:)/g, '$1"$2"$3')
    .replace(/,\s*([}\]])/g, '$1');
  const parsed = JSON.parse(normalizedContent) as { questions?: unknown };
  if (!Array.isArray(parsed.questions) || parsed.questions.length !== 10) {
    throw new Error('Quiz provider did not return 10 questions');
  }

  return parsed.questions.map((item, index) => {
    if (!item || typeof item !== 'object') throw new Error('Quiz provider returned an invalid question');
    const question = item as Record<string, unknown>;
    if (
      typeof question.question !== 'string' ||
      !Array.isArray(question.options) ||
      question.options.length !== 4 ||
      !question.options.every((option) => typeof option === 'string') ||
      typeof question.correctAnswer !== 'string' ||
      !LETTERS.includes(question.correctAnswer as typeof LETTERS[number]) ||
      typeof question.explanation !== 'string' ||
      typeof question.difficulty !== 'string' ||
      !DIFFICULTIES.includes(question.difficulty as typeof DIFFICULTIES[number])
    ) {
      throw new Error('Quiz provider returned a malformed question');
    }

    return {
      id: index + 1,
      skill,
      difficulty: question.difficulty as QuizQuestion['difficulty'],
      question: question.question,
      options: question.options as string[],
      correctAnswer: question.correctAnswer as QuizQuestion['correctAnswer'],
      explanation: question.explanation,
    };
  });
}