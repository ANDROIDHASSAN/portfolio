import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";

// Single source of truth. Nothing here is a claim that is not true today:
// planned / in-progress work carries its status, and every number on it is a "Target".
export type Status = "shipped" | "in-review" | "in-progress" | "planned";

export const STATUS_LABEL: Record<Status, string> = {
  shipped: "Shipped",
  "in-review": "PR in review",
  "in-progress": "In progress",
  planned: "Planned",
};

const arxiv = (id: string) => ({ title: `arXiv ${id}`, href: `https://arxiv.org/abs/${id}` });
const REPO = "https://github.com/ANDROIDHASSAN/portfolio";
const code = (file: string) => ({ label: `code: ${file}`, href: `${REPO}/blob/main/${file}` });
const prod = (where: string) => ({ label: `production: ${where}`, href: "" });
const gh = (repo: string) => ({ title: "Code", href: `https://github.com/ANDROIDHASSAN/${repo}` });

export const DATA = {
  name: "Hassan Kazi",
  initials: "HK",
  url: "https://hassankazi.vercel.app",
  location: "Bengaluru, India · open to remote (IST)",
  locationLink: "https://www.google.com/maps/place/Bengaluru",
  title: "Voice AI Research Engineer",
  description:
    "Voice AI Research Engineer. I build real-time voice agents and I'm chasing one question: why do voice agents break on real Indian speech, and how do we fix it?",
  summary:
    "I lead the AI & real-time stack behind [InCruiter](https://incruiter.com)'s voice interviewers, scaled to **1,000+ concurrent interviews in 42+ languages**. In production I root-caused why multilingual interviews broke: English-only text guards failed on Devanagari (0.39 vs a 0.5 match threshold) and Marathi STT hallucinated in 10 of 15 turns, then shipped script-aware, feature-flagged fixes.\n\nNow I'm rebuilding the speech stack [from the papers up](/#papers), starting with Hindi and Marathi, and fixing the frameworks voice agents run on: [16 merged PRs](/#open-source), 7 of them in LiveKit. Before InCruiter I built WhatsApp automation and real-time voice agents at [Anantkamal Software Labs](https://anantkamalsoftwarelabs.com) in Nashik, and worked as an AI engineer at myRide (Boston, remote) on autonomous-vehicle rule validation. Also a [9× hackathon winner](/#achievements).",
  avatarUrl: "/me.webp",
  // Printed from /resume (this file's data) by `pnpm resume:pdf`; rerun it after editing anything below.
  resumePdf: "/hassan-kazi-resume.pdf",
  skills: [
    { name: "LiveKit Agents" },
    { name: "WebRTC" },
    { name: "Vapi" },
    { name: "Twilio" },
    { name: "Exotel" },
    { name: "Telephony (PSTN)" },
    { name: "STT / TTS" },
    { name: "Deepgram" },
    { name: "ElevenLabs" },
    { name: "Silero VAD" },
    { name: "Sarvam AI" },
    { name: "Azure OpenAI" },
    { name: "Groq · gpt-oss" },
    { name: "LLM tool calling" },
    { name: "Prompt engineering" },
    { name: "LLM guardrails" },
    { name: "Model fallback routing" },
    { name: "Python", icon: Python },
    { name: "TypeScript", icon: Typescript },
    { name: "Node.js", icon: Nodejs },
    { name: "React", icon: ReactLight },
    { name: "Docker", icon: Docker },
    { name: "Kubernetes", icon: Kubernetes },
    { name: "PostgreSQL", icon: Postgresql },
    { name: "GitHub Actions" },
    { name: "PyTorch · learning" },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Notes" },
  ],
  contact: {
    email: "hassankazinasik@gmail.com",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/ANDROIDHASSAN",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/erhassankazi",
        icon: Icons.linkedin,
        navbar: true,
      },
      Email: {
        name: "Email",
        url: "mailto:hassankazinasik@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "InCruiter",
      href: "https://incruiter.com",
      location: "Bengaluru",
      title: "Product Developer — AI & Real-time Engineering",
      logoUrl: "/logos/incruiter.webp",
      start: "Jul 2026",
      end: "Present",
      description:
        "Lead the AI & real-time stack for InCBot (AI video interviewer) and IncScreen (AI phone & WhatsApp screening, which I built from scratch on Twilio and Exotel telephony with Vapi); scaled to 1,000+ concurrent interviews. Root-caused why multilingual interviews broke: English-only text guards failed on Devanagari (0.39 vs 0.5 match threshold) and Marathi STT hallucinated in 10 of 15 turns; drove script-aware, feature-flagged fixes.",
    },
    {
      company: "Anantkamal Software Labs",
      href: "https://anantkamalsoftwarelabs.com",
      location: "Nashik",
      title: "Software Engineer — AI & Automation",
      logoUrl: "/logos/anantkamal.webp",
      // TODO(hassan): add start/end dates; the row hides the date column while these are empty.
      start: "",
      end: "",
      description:
        "Worked on WhatsApp automation and real-time voice agents. Full-stack MERN development (MongoDB, Express.js, React, Node.js) across multiple projects, including Raise Wademo, Hobbit and Ping Me: frontend implementation, backend API integration, database operations, debugging and feature development.",
    },
    {
      company: "Fuzen.io",
      href: "https://fuzen.io",
      location: "Nashik",
      title: "Software Developer Intern",
      logoUrl: "/logos/fuzen.webp",
      start: "Sep 2025",
      end: "Dec 2025",
      description:
        "Shipped 5+ responsive React/JavaScript apps for 4+ clients, cutting page load time by 40%. Refactored 3 legacy codebases, raising SonarQube maintainability scores by 35%.",
    },
    {
      company: "myRide",
      href: "",
      location: "Boston, MA · remote",
      title: "AI Engineer",
      // Monogram: no verifiable official logo or site was found for myRide.
      logoUrl: "/logos/myride.webp",
      start: "Mar 2025",
      end: "Aug 2025",
      description:
        "Built a 5,000+ rule Boston parking-regulations dataset for autonomous-vehicle rule validation. Designed a real-time data pipeline and frontend used across 10+ AV models, with a US team.",
    },
  ],
  education: [
    {
      school: "Sandip University",
      href: "https://www.sandipuniversity.edu.in",
      degree: "B.Tech, Computer Science & Engineering",
      logoUrl: "/logos/sandip-university.webp",
      start: "2023",
      end: "Present",
    },
    {
      school: "Guru Gobind Singh Polytechnic",
      href: "",
      degree: "Diploma, Computer Engineering",
      // Monogram: the college site blocks automated requests, so no official logo could be fetched.
      logoUrl: "/logos/ggsp.webp",
      start: "2020",
      end: "2023",
    },
  ],
  projects: [
    {
      title: "Own Voice AI Models",
      href: "",
      status: "in-progress" as Status,
      dates: "STT · LLM · TTS · real-time orchestrator",
      description:
        "My own Hindi/Marathi ASR and TTS models and a LoRA-tuned LLM, joined by a from-scratch streaming orchestrator (VAD, end-of-turn, barge-in); ONNX, INT8, speculative decoding.\n\n**Target:** ~800 ms p50 voice-to-voice, ~5× lower cost/min than hosted APIs.",
      technologies: ["PyTorch", "ONNX", "asyncio", "WebRTC"],
      links: [],
      image: "/diagrams/latency-light.svg",
      imageDark: "/diagrams/latency-dark.svg",
    },
    {
      title: "InCBot — AI Video Interviewer",
      href: "https://incruiter.com",
      status: "shipped" as Status,
      dates: "Production @ InCruiter",
      description:
        "STT → LLM (tool calling) → TTS interviewer with feature-flagged guards; Docker CI/CD to LiveKit Cloud via GitHub Actions; runs in 42+ languages.",
      technologies: ["Python", "LiveKit Agents", "Azure OpenAI GPT-4.1 / 4o", "WebRTC"],
      links: [{ type: "InCruiter", href: "https://incruiter.com", icon: <Icons.globe className="size-3" /> }],
      image: "/diagrams/architecture-light.svg",
      imageDark: "/diagrams/architecture-dark.svg",
    },
    {
      title: "IncScreen — AI Phone & WhatsApp Screening",
      href: "https://incruiter.com",
      status: "shipped" as Status,
      dates: "Production @ InCruiter · built from scratch",
      description:
        "Built from scratch: AI screening phone calls over Twilio and Exotel telephony, orchestrated with Vapi, plus WhatsApp interviews. Multilingual question sets, 7 Hindi voices, voicemail detection and fluency scoring. Hindi call-quality work: replies took ~5 s vs ~2 s in English, plus cut-off speech and interruptions.",
      technologies: ["Twilio", "Exotel", "Vapi", "Webhooks", "Python"],
      links: [{ type: "InCruiter", href: "https://incruiter.com", icon: <Icons.globe className="size-3" /> }],
      image: "/logos/incscreen-banner.webp",
      imageDark: "",
    },
    {
      title: "This site's AI voice clone",
      href: `${REPO}/tree/main/voice-agent`,
      status: "shipped" as Status,
      dates: "Live on this page · open source",
      description:
        "Talks in English, Hindi or Marathi and switches when you do. Three-deep fallback chains for STT, LLM and TTS; keyterm-prompted STT; per-reply voice routing (Hindi and Marathi share a script, so it reads the reply's words); false-interruption recovery; Krisp noise cancellation; hangs up on silent callers. Five Python files, deployed to LiveKit Cloud by GitHub Actions.",
      technologies: ["LiveKit Agents", "Sarvam", "Deepgram", "ElevenLabs", "Groq gpt-oss"],
      links: [
        { type: "Talk to it", href: "/#talk", icon: <Icons.globe className="size-3" /> },
        { type: "Source", href: `${REPO}/tree/main/voice-agent`, icon: <Icons.github className="size-3" /> },
      ],
      image: "/diagrams/architecture-light.svg",
      imageDark: "/diagrams/architecture-dark.svg",
    },
    {
      title: "IndicVoiceBench",
      href: "",
      status: "planned" as Status,
      dates: "Benchmark for voice agents on Indian speech",
      description:
        "Ranks STT/TTS models (Sarvam, ElevenLabs, Deepgram, Cartesia, OpenAI, Whisper) on Hindi, Marathi and Hinglish phone audio: WER, time-to-first-byte, MOS; public leaderboard.\n\n**Target:** 10+ models benchmarked.",
      technologies: ["Python", "WER", "MOS", "HF Spaces"],
      links: [],
      visual: "bench",
      image: "",
      imageDark: "",
    },
    {
      title: "Hinglish Turn Detector",
      href: "",
      status: "planned" as Status,
      dates: "Code-mixed end-of-turn model",
      description:
        "Small transformer trained on Hinglish/Marathi dialogue (after VAP), shipped as a LiveKit Agents plugin.\n\n**Target:** ~30% fewer false interruptions than VAD-only.",
      technologies: ["PyTorch", "LiveKit Agents"],
      links: [],
      visual: "turn",
      image: "",
      imageDark: "",
    },
    {
      title: "indic-guard",
      href: "",
      status: "planned" as Status,
      dates: "Script-aware text matching",
      description:
        "Fuzzy-matches Devanagari, romanized and code-mixed text; born from the 0.39-vs-0.5 production bug.\n\n**Target:** published on PyPI.",
      technologies: ["Python", "PyPI"],
      links: [],
      visual: "guard",
      image: "",
      imageDark: "",
    },
    {
      title: "Bhasha Bridge",
      href: "",
      status: "planned" as Status,
      dates: "Real-time translated phone calls · मराठी ⇄ English",
      description:
        "Call any Indian number: each side hears the other in their own language and cloned voice (LiveKit SIP, STT → IndicTrans2 → F5-TTS).\n\n**Target:** ~2 s end-to-end.",
      technologies: ["LiveKit SIP", "IndicTrans2", "F5-TTS"],
      links: [],
      visual: "bhasha",
      image: "",
      imageDark: "",
    },
    {
      title: "Prompt-Injection Guard for Voice Agents",
      href: "",
      status: "planned" as Status,
      dates: "Red-teaming with spoken attacks",
      description:
        "Red-team a voice agent with spoken attacks; a guard model blocks them.\n\n**Target:** 200+ spoken attacks tested.",
      technologies: ["Red-teaming", "Guard model"],
      links: [],
      visual: "injection",
      image: "",
      imageDark: "",
    },
  ],
  // What breaks real voice agents and what I do about it. Every line points at production work or at code you can read.
  playbook: [
    {
      problem: "Phone calls, not just browsers",
      fix: "PSTN calls over Twilio and Exotel with Vapi orchestrating STT → LLM → TTS, call events over webhooks, voicemail detection so the agent never interviews an answering machine.",
      proof: [prod("IncScreen, built from scratch")],
    },
    {
      problem: "Interruptions and barge-in",
      fix: "Callers can cut in, but a cough or an “hmm” doesn't kill the sentence: a false interruption resumes the reply after 1 s. Fixed cut-off speech on Hindi calls.",
      proof: [code("voice-agent/agent.py"), prod("IncScreen")],
    },
    {
      problem: "STT mishears names and jargon",
      fix: "Keyterm prompting: product names, people and tech words are pushed into Deepgram nova-3 keyterms and Sarvam's prompt, so “InCruiter” stops coming back as something else.",
      proof: [code("voice-agent/stt.py")],
    },
    {
      problem: "Hindi, Marathi and Hinglish in one call",
      fix: "STT auto-detects the language; the voice is picked from the reply itself (Hindi and Marathi share Devanagari, so marker words decide), and each language has its own TTS chain.",
      proof: [code("voice-agent/agent.py"), code("voice-agent/tts.py")],
    },
    {
      problem: "Guards that only read English",
      fix: "Script-aware, feature-flagged matching after an English-only guard scored a correct Devanagari answer 0.39 against a 0.5 threshold. Diagnosed Marathi STT hallucinating in 10 of 15 turns.",
      proof: [prod("InCBot"), { label: "write-up", href: "/blog/why-voice-agents-break-on-hindi" }],
    },
    {
      problem: "Providers fail mid-call",
      fix: "Every stage has a fallback chain: three STT engines, three LLMs, a TTS chain per language. A rate limit mid-call moves to the next model and the call carries on.",
      proof: [code("voice-agent/llm.py"), code("voice-agent/tts.py")],
    },
    {
      problem: "Latency that compounds",
      fix: "Per-stage latency budgets, streaming everywhere, preemptive generation that starts the reply before the turn is final, one 24 kHz format across voices.",
      proof: [code("voice-agent/agent.py"), { label: "write-up", href: "/blog/sub-second-hindi-voice-agent" }],
    },
    {
      problem: "LLMs that ramble or make things up",
      fix: "Voice-specific prompting: hard word cap with a server-side trim, markdown and emoji stripped before TTS, scope lock, prompt-injection resistance, no invented facts, AI disclosure.",
      proof: [code("voice-agent/brain.py")],
    },
    {
      problem: "Noisy rooms and echo",
      fix: "Krisp noise cancellation on the caller's audio in the agent, echo cancellation and auto gain in the browser.",
      proof: [code("voice-agent/agent.py"), code("web/src/components/voice-agent.tsx")],
    },
    {
      problem: "Cost and abuse on a public agent",
      fix: "One-minute mic-only tokens bound to this site's origin, per-IP rate limit, 5-minute cap, hang-up after 45 s of silence, no call recording.",
      proof: [code("web/src/app/api/voice-token/route.ts"), code("voice-agent/agent.py")],
    },
  ],
  // Merged PRs only. State and diff size are fetched live from GitHub (src/lib/github.ts).
  openSource: [
    { repo: "livekit/agents", pr: 7741, title: "fix(voice): don't hang or buffer audio when the recorder encoder fails", description: "A failed encoder setup made AgentSession.aclose() hang forever and queued audio in memory for the rest of the session.", writeup: true },
    { repo: "livekit/agents", pr: 7742, title: "fix(tokenize): ignore stray closing tags in the XML depth check", description: "A closing tag without its opener drove a depth counter negative and split <emotion> spans across TTS chunks. One-line fix.", writeup: true },
    { repo: "livekit/python-sdks", pr: 860, title: "fix(api): report a missing sha256 claim in WebhookReceiver", description: "A webhook token without a body hash was rejected as \"hash mismatch\", because the verifier fills the missing claim with an empty string." },
    { repo: "livekit/python-sdks", pr: 861, title: "fix(api): keep the base path of the server URL in Twirp requests", description: "Since region failover, a server URL behind a reverse-proxy path lost its path, so every API call went to the wrong place." },
    { repo: "livekit/python-sdks", pr: 862, title: "fix(rtc): keep an AudioMixer input alive after a read timeout", description: "One late frame cancelled an async-generator input, which closed it: the mixer dropped the rest of that stream's audio." },
    { repo: "livekit/python-sdks", pr: 864, title: "fix(rtc): use the right plane layout for I420A, I422 and NV12 frames", description: "Chroma was sized width × width, so a 640×480 NV12 frame copied 512,000 bytes instead of 460,800 out of native memory." },
    { repo: "livekit/python-sdks", pr: 865, title: "fix(api): support the canSubscribeMetrics video grant", description: "Python couldn't mint the grant, and TokenVerifier silently dropped it from tokens minted by other SDKs." },
    { repo: "KoljaB/RealtimeSTT", pr: 329, title: "fix: add the final period when a transcript ends in a vowel sign", description: "Hindi, Bengali and Tamil transcripts lost their full stop whenever the last letter carried a vowel sign (matra)." },
    { repo: "KoljaB/RealtimeSTT", pr: 330, title: "fix: don't crash feed_audio on a chunk too short to resample", description: "An empty or sub-sample audio chunk raised ZeroDivisionError into the caller's streaming loop." },
    { repo: "KoljaB/RealtimeSTT", pr: 332, title: "fix: start the server with the client's empty language", description: "The client dropped language=\"\", so an autostarted server fell back to English instead of auto-detecting." },
    { repo: "KoljaB/RealtimeTTS", pr: 383, title: "fix: send ElevenlabsEngine voice settings with each request", description: "Stability, clarity and style were stored but never sent after the move to the streaming endpoint." },
    { repo: "KoljaB/stream2sentence", pr: 16, title: "Split sentences at the Urdu full stop (۔)", description: "Urdu text streamed to TTS as one long sentence." },
    { repo: "KoljaB/stream2sentence", pr: 17, title: "Let the nltk+rule-based tokenizer split at । 。 ؟ ۔", description: "The default tokenizer never split Hindi, Chinese, Arabic or Urdu text into sentences." },
    { repo: "KoljaB/stream2sentence", pr: 18, title: "Don't add a space when joining short Chinese and Japanese sentences", description: "Merging short CJK sentences inserted a space that doesn't belong in those scripts." },
    { repo: "OHF-Voice/piper1-gpl", pr: 328, title: "Phonemize Hebrew in infer_torch instead of falling through to espeak-ng", description: "A Hebrew voice was checked with different phonemes than it was trained on, with no error." },
    { repo: "mastra-ai/mastra", pr: 27102, title: "fix(voice-sarvam): use the configured listening model in listen()", description: "SarvamVoice.listen() ignored the constructor's model, language and mode and always sent the defaults." },
  ],
  // Reimplemented from scratch, adapted to Hindi/Marathi. Public ones link their repo; numbers are from their READMEs.
  papers: [
    { title: "Transformer", dates: "LLM", location: "Vaswani et al. 2017 · public", description: "English → Hindi on the IITB corpus: 12.7 sacreBLEU, 39.3 chrF2 on the WAT test set.", links: [gh("attention-is-all-you-need-hindi"), arxiv("1706.03762")] },
    { title: "GPT + BPE Tokenizer", dates: "LLM", location: "Radford et al. 2019 · Sennrich et al. 2016 · public", description: "12M-param GPT with RoPE, SwiGLU, KV cache and LoRA; its 4,096-token BPE needs 3.9× fewer tokens than GPT-4's on Hindi.", links: [gh("gpt-from-scratch"), arxiv("1508.07909")] },
    { title: "Quantization + FlashAttention", dates: "LLM", location: "Dettmers et al. 2022 · Frantar et al. 2023 · Dao et al. 2022 · public", description: "On Qwen2.5-0.5B (WikiText-2 perplexity 12.98): LLM.int8() 13.02, 4-bit GPTQ 14.00 vs 15.46 round-to-nearest.", links: [gh("quant-flash"), arxiv("2208.07339"), arxiv("2210.17323"), arxiv("2205.14135")] },
    { title: "LoRA + DPO + GRPO", dates: "LLM", location: "Hu et al. 2022 · Rafailov et al. 2023 · Shao et al. 2024 · public", description: "Code complete and checked: teach Qwen2.5-0.5B to follow Hindi instructions and answer in Hindi. Training runs next.", links: [gh("post-training"), arxiv("2106.09685"), arxiv("2305.18290"), arxiv("2402.03300")] },
    { title: "Speculative Decoding", dates: "LLM", location: "Leviathan et al. 2023 · public", description: "1.5B target, 0.5B draft: 3.4 tokens per target pass at γ = 4, but 0.8× wall-clock on an M1 GPU. Measured, not tuned.", links: [gh("speculative-decoding"), arxiv("2211.17192")] },
    { title: "Prompt-Injection Defense", dates: "LLM", location: "Greshake et al. 2023", description: "Target: 200+ spoken attacks.", links: [arxiv("2302.12173")] },
    { title: "Whisper", dates: "ASR", location: "Radford et al. 2022 · public", description: "Loads OpenAI's weights: 14.2% WER on FLEURS English. whisper-tiny fine-tuned on Hindi: 138.9% → 49.2% WER.", links: [gh("whisper-from-scratch"), arxiv("2212.04356")] },
    { title: "Conformer + RNN-T", dates: "ASR", location: "Gulati et al. 2020 · Graves 2012 · public", description: "Code complete; the transducer loss is checked against brute force. Training runs next.", links: [gh("conformer-rnnt"), arxiv("2005.08100"), arxiv("1211.3711")] },
    { title: "wav2vec 2.0", dates: "ASR", location: "Baevski et al. 2020", description: "Target: self-supervised on Hindi audio.", links: [arxiv("2006.11477")] },
    { title: "VITS + HiFi-GAN", dates: "TTS", location: "Kim et al. 2021 · Kong et al. 2020", description: "Target: a Hindi voice.", links: [arxiv("2106.06103"), arxiv("2010.05646")] },
    { title: "StyleTTS 2", dates: "TTS", location: "Li et al. 2023", description: "Target: expressive Hindi.", links: [arxiv("2306.07691")] },
    { title: "F5-TTS", dates: "TTS", location: "Chen et al. 2024", description: "Target: zero-shot cloning from 10 s.", links: [arxiv("2410.06885")] },
    { title: "RVQ Codec + Mini-Moshi", dates: "Audio", location: "Zeghidour et al. 2021 · Défossez et al. 2024", description: "Target: audio tokens; a full-duplex speech LLM.", links: [arxiv("2107.03312"), arxiv("2410.00037")] },
    { title: "Voice Activity Projection", dates: "Audio", location: "Ekstedt & Skantze 2022", description: "Target: fewer interruptions than VAD.", links: [arxiv("2205.09812")] },
  ],
  achievements: [
    { title: "9× Hackathon Winner", detail: "" },
    { title: "CodeChef 3-Star", detail: "Top 15% globally; 1st in October Long Challenge among 8,000+ coders" },
    { title: "16 merged open-source PRs", detail: "7 in LiveKit (agents, python-sdks), plus RealtimeSTT/TTS, Piper and Mastra, since Oct 2026" },
    { title: "Technical Lead, Leads Community", detail: "2024 – present · 5+ workshops for 200+ students; 4 hackathons with 1,500+ participants" },
  ],
  certifications: {
    earned: ["Google Cloud — 5 Skill Badges", "Deep Learning with PyTorch", "Generative AI Concepts", "AI Solutions in Business"],
    inProgress: ["Hugging Face Audio Course", "Anthropic Academy", "DeepLearning.AI × LiveKit — Voice Agents", "NVIDIA GenAI LLMs Professional", "Claude Certified Architect"],
  },
} as const;
