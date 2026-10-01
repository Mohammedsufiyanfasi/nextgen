import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { loadEnv, type Plugin } from 'vite';
import { generateQuizWithOpenRouter } from './server/quizGenerator';

function quizApiPlugin(apiKey: string): Plugin {
  return {
    name: 'quiz-generation-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-quiz', async (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.end('Method not allowed');
          return;
        }

        if (!apiKey) {
          response.statusCode = 503;
          response.end('Quiz generation is not configured');
          return;
        }

        try {
          let body = '';
          for await (const chunk of request) {
            body += chunk.toString();
            if (body.length > 4096) throw new Error('Request is too large');
          }
          const { skill } = JSON.parse(body) as { skill?: unknown };
          if (typeof skill !== 'string') throw new Error('Invalid quiz subject');

          const questions = await generateQuizWithOpenRouter(skill, apiKey);
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ questions }));
        } catch (error) {
          response.statusCode = 502;
          response.end(error instanceof Error ? error.message : 'Quiz generation failed');
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), quizApiPlugin(env.OPENROUTER_API_KEY)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
