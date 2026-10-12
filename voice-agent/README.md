# Hassan's portfolio voice agent

An AI clone that answers questions about my portfolio and gives voice-AI career advice, and nothing else.

| File | Job |
|---|---|
| `stt.py` | Sarvam `saaras:v4` (Hindi/Marathi/English auto-detect) → Deepgram `nova-3` multi → Groq `whisper-large-v3` |
| `llm.py` | Groq `openai/gpt-oss-120b` → LiveKit Inference `gpt-4.1-mini` → Groq `openai/gpt-oss-20b` (ordered by how well each follows the prompt) |
| `tts.py` | One chain per language. en: ElevenLabs Flash v2.5 → Sarvam → Cartesia → Orpheus; hi: Sarvam → ElevenLabs → Cartesia; mr: Sarvam → Cartesia |
| `brain.py` | Persona, language rules, guardrails and everything the agent knows. Keep it in sync with the site. |
| `agent.py` | LiveKit entrypoint: Krisp noise cancellation, turn handling, per-reply language, 5-minute cap, hang-up after 45 s of silence, no recording |

Every provider except LiveKit and Groq is optional: an engine without its key is skipped.

## Free stack and its limits

| Piece | Service | Free allowance (check the live pages, they change) |
|---|---|---|
| Orchestration + agent hosting | LiveKit Cloud **Build** plan | 1,000 agent-minutes/month, 5 concurrent calls, 1 deployed agent, no card |
| STT + TTS (Indian languages) | Sarvam AI | one-time signup credits (₹100–₹1,000), never expire |
| LLM + fallback STT | Groq | gpt-oss only: 8,000 tokens/min and 200,000 tokens/day per model (well under 100 turns/day); ~2,000 Whisper requests/day |
| TTS fallbacks | LiveKit Inference, Groq Orpheus | Build-plan inference credits; ~100 Orpheus requests/day |
| Noise cancellation | LiveKit Krisp BVC | reported as included on Build; `NOISE_CANCELLATION=0` turns it off |
| Website + token API | Vercel Hobby | free |

A 5-minute call cap and a 5-calls-per-hour-per-IP limit on the token route keep usage inside these.
On the Build plan an idle agent can take 10–20 s to wake up for the first call.

## Run locally

```bash
cp .env.example .env.local        # fill in your personal LiveKit + Groq keys
python -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python agent.py console # talk to it in the terminal
.venv/bin/python agent.py dev     # or join from the portfolio at localhost:3000
```

## Deploy for free

1. Create a **personal** LiveKit Cloud project at https://cloud.livekit.io (Build plan, no card).
   This machine's `lk` CLI only knows InCruiter projects, so add yours and always pass it explicitly:
   ```bash
   lk cloud auth                     # log in, pick your personal project
   lk project list                   # note its name
   ```
2. Get a free Groq key at https://console.groq.com/keys. If Groq says the Orpheus model needs its
   terms accepted, accept them once in the Groq console playground.
3. Create the agent once from this folder (the Dockerfile is already generated). Runtime secrets go up here and
   stay stored in LiveKit Cloud; LiveKit injects its own `LIVEKIT_*` values, so leave them out:
   ```bash
   grep -vE '^(LIVEKIT_|#|\s*$)' .env.local > /tmp/agent-secrets.env
   lk agent create --project <your-personal-project> --region ap-south --secrets-file /tmp/agent-secrets.env .
   rm /tmp/agent-secrets.env
   ```
   Commit the `livekit.toml` it writes. From then on every push to `main` that touches `voice-agent/` is deployed
   by `.github/workflows/voice-agent.yml`, using the `LIVEKIT_URL`, `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET`
   repository secrets. Rotating a provider key: `lk agent update-secrets`.
4. In Vercel (portfolio/web) add `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` from the same
   personal project and redeploy. The "Talk to my AI" button turns on by itself.
