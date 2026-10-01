# next_gen

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-ya6zochq)

## Quiz generation

Quiz attempts are generated with OpenRouter using `nvidia/nemotron-3-ultra-550b-a55b:free`.
For local development, copy `.env.example` to `.env.local` and set `OPENROUTER_API_KEY` to a valid key, then restart the Vite dev server. The key is read by the server middleware and is never included in the browser bundle.

For Vercel deployments, configure `OPENROUTER_API_KEY` as a server-side environment variable. The `/api/generate-quiz` function uses the same generator. Other hosting providers need an equivalent server-side route; do not expose the key via a `VITE_` variable.

When generation is unavailable, the app falls back to a shuffled local quiz bank. The latest attempt, including its questions and submitted answers, is saved for the result review.
