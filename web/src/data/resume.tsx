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
    "I lead the AI & real-time stack behind [InCruiter](https://incruiter.com)'s voice interviewers, scaled to **1,000+ concurrent interviews in 42+ languages**. In production I root-caused why multilingual interviews broke: English-only text guards failed on Devanagari (0.39 vs a 0.5 match threshold) and Marathi STT hallucinated in 10 of 15 turns, then shipped script-aware, feature-flagged fixes.\n\nNow I'm rebuilding the speech stack [from the papers up](/#papers), starting with Hindi and Marathi, and sending fixes upstream to [livekit/agents](/#open-source). Before InCruiter I built WhatsApp automation and real-time voice agents at [Anantkamal Software Labs](https://anantkamalsoftwarelabs.com) in Nashik, and worked as an AI engineer at myRide (Boston, remote) on autonomous-vehicle rule validation. Also a [9× hackathon winner](/#achievements).",
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
  // Status and diff size are fetched live from GitHub (src/lib/github.ts); test counts are from each PR's description.
  openSource: [
    {
      repo: "livekit/agents",
      pr: 7740,
      title: "feat(voice): add bit_rate and constant_bit_rate options to RecorderIO",
      description: "Opus VBR made macOS show a 3:32 recording as 6:53+. Adds bit_rate / constant_bit_rate so recordings can match Egress (constant 128 kb/s).",
      tests: "34 tests passed",
    },
    {
      repo: "livekit/agents",
      pr: 7741,
      title: "fix(voice): don't hang or buffer audio when the recorder encoder fails",
      description: "A failed encoder setup made AgentSession.aclose() hang forever and queued audio in memory for the rest of the session.",
      tests: "4,966 unit tests passed",
    },
    {
      repo: "livekit/agents",
      pr: 7742,
      title: "fix(tokenize): ignore stray closing tags in the XML depth check",
      description: "A closing tag without its opener drove a depth counter negative and split <emotion> spans across TTS chunks. One-line fix.",
      tests: "109 tests passed",
    },
  ],
  // All planned: reimplemented from scratch, adapted to Hindi/Marathi. Repos go public when they ship.
  papers: [
    { title: "GPT + BPE Tokenizer", dates: "LLM", location: "Vaswani et al. 2017 · Sennrich et al. 2016", description: "Target: 50M-param Hinglish GPT; ~3× fewer tokens on Hindi.", links: [arxiv("1706.03762"), arxiv("1508.07909")] },
    { title: "Quantization + FlashAttention", dates: "LLM", location: "Dettmers et al. 2022 · Frantar et al. 2023 · Dao et al. 2022", description: "Target: INT8/INT4 + a fused Triton kernel.", links: [arxiv("2208.07339"), arxiv("2210.17323"), arxiv("2205.14135")] },
    { title: "LoRA + DPO + GRPO", dates: "LLM", location: "Hu et al. 2022 · Rafailov et al. 2023 · Shao et al. 2024", description: "Target: SFT → preference → RL on a Hindi 0.5B model.", links: [arxiv("2106.09685"), arxiv("2305.18290"), arxiv("2402.03300")] },
    { title: "Speculative Decoding", dates: "LLM", location: "Leviathan et al. 2023", description: "Target: ~2× faster replies.", links: [arxiv("2211.17192")] },
    { title: "Prompt-Injection Defense", dates: "LLM", location: "Greshake et al. 2023", description: "Target: 200+ spoken attacks.", links: [arxiv("2302.12173")] },
    { title: "Whisper", dates: "ASR", location: "Radford et al. 2022", description: "Target: Hindi fine-tune.", links: [arxiv("2212.04356")] },
    { title: "Conformer + RNN-T", dates: "ASR", location: "Gulati et al. 2020 · Graves 2012", description: "Target: streaming ASR, ablation reproduced.", links: [arxiv("2005.08100"), arxiv("1211.3711")] },
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
    { title: "30+ merged open-source PRs", detail: "Across 15 repos, Hacktoberfest 2022–2024" },
    { title: "Technical Lead, Leads Community", detail: "2024 – present · 5+ workshops for 200+ students; 4 hackathons with 1,500+ participants" },
  ],
  certifications: {
    earned: ["Google Cloud — 5 Skill Badges", "Deep Learning with PyTorch", "Generative AI Concepts", "AI Solutions in Business"],
    inProgress: ["Hugging Face Audio Course", "Anthropic Academy", "DeepLearning.AI × LiveKit — Voice Agents", "NVIDIA GenAI LLMs Professional", "Claude Certified Architect"],
  },
} as const;
