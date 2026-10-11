# hassankazi.vercel.app

My portfolio, plus the voice agent behind its "Talk to my AI" button.

| Folder | What | Deploys to |
|---|---|---|
| [`web/`](web) | Next.js 16 site: work, projects, notes, résumé, and the in-browser call UI with a live transcript | Vercel, on every push to `main` (previews on PRs) |
| [`voice-agent/`](voice-agent) | LiveKit Agents (Python) AI clone that answers in English, Hindi or Marathi | LiveKit Cloud, by [GitHub Actions](.github/workflows/voice-agent.yml) when `voice-agent/` changes |

How a call works: the browser asks `web/src/app/api/voice-token` for a one-minute, mic-only LiveKit token; the token
dispatches `hassan-agent` into a fresh room; the agent runs STT (Sarvam, Deepgram, Whisper) → LLM (gpt-oss on Groq) →
TTS (ElevenLabs, Sarvam, Cartesia), each with fallbacks, and streams the transcript back to the page.

Everything on the site is meant to be true today: planned work is labelled as planned and its numbers are targets.
