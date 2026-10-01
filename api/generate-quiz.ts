import { generateQuizWithOpenRouter } from '../server/quizGenerator';

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return response.status(503).json({ error: 'Quiz generation is not configured' });

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const skill = (body as { skill?: unknown } | null)?.skill;
    if (typeof skill !== 'string') return response.status(400).json({ error: 'Invalid quiz subject' });

    const questions = await generateQuizWithOpenRouter(skill, apiKey);
    return response.status(200).json({ questions });
  } catch {
    return response.status(502).json({ error: 'Quiz generation failed; use the local question set instead' });
  }
}