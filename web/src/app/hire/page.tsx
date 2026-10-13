import { DATA, STATUS_LABEL } from "@/data/resume";
import { ArrowLeft, Download, Mail, Mic } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hire a Voice AI Engineer (LiveKit, telephony, Hindi/Marathi)",
  description:
    "Looking for a voice AI or AI engineer? I build production voice agents: LiveKit and WebRTC, phone calls over Twilio, Exotel and Vapi, multilingual STT/TTS for Hindi, Marathi and English, LLM tool calling and guardrails. Bengaluru, open to remote.",
  alternates: { canonical: "/hire" },
};

// The hiring landing page: same facts as the home page, ordered for someone deciding whether to reach out.
const OFFER = [
  { what: "Real-time voice agents", how: "LiveKit Agents over WebRTC: STT → LLM with tool calling → TTS, turn-taking and barge-in that hold up on real calls.", proof: "/#projects" },
  { what: "Phone-call agents", how: "AI phone calls over Twilio and Exotel, orchestrated with Vapi; voicemail detection, call events over webhooks.", proof: "/blog/telephony-vs-webrtc-voice-agents" },
  { what: "Indian languages", how: "Hindi, Marathi, English and Hinglish in one call: language detection, per-language voices, script-aware guards.", proof: "/blog/why-voice-agents-break-on-hindi" },
  { what: "Reliability and accuracy", how: "Fallback chains for every provider, keyterm-prompted STT, voice-specific prompts that don't ramble or invent facts.", proof: "/#playbook" },
  { what: "Shipping it", how: "Docker and GitHub Actions to LiveKit Cloud, rate limits and abuse controls on public agents, latency budgets per stage.", proof: "/blog/free-multilingual-voice-agent" },
];

export default function Hire() {
  const shipped = DATA.projects.filter((p) => p.status === "shipped");
  return (
    <main className="flex flex-col gap-12">
      <Link href="/" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Home
      </Link>

      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">Hiring a voice AI engineer?</h1>
        <p className="text-muted-foreground md:text-lg text-pretty">
          I&apos;m {DATA.name}. I lead the AI and real-time stack behind InCruiter&apos;s voice interviewers (1,000+ concurrent
          interviews, 42+ languages) and built its AI phone screening from scratch. {DATA.location}.
        </p>
        <div className="flex flex-wrap gap-2">
          <a href={`mailto:${DATA.contact.email}?subject=Voice%20AI%20role`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <Mail className="size-4" /> Email me
          </a>
          <a href={DATA.resumePdf} download="Hassan-Kazi-Resume.pdf" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <Download className="size-4" /> Résumé (PDF)
          </a>
          <Link href="/#talk" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <Mic className="size-4" /> Interview my AI clone first
          </Link>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">What I can build for you</h2>
        <div className="flex flex-col gap-4">
          {OFFER.map((o) => (
            <div key={o.what} className="flex flex-col gap-1">
              <h3 className="font-semibold">{o.what}</h3>
              <p className="text-sm text-muted-foreground">
                {o.how}{" "}
                <Link href={o.proof} className="text-foreground underline-offset-4 hover:underline">See proof →</Link>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Shipped</h2>
        <ul className="flex flex-col gap-3">
          {shipped.map((p) => (
            <li key={p.title} className="text-sm">
              <span className="font-semibold">{p.title}</span>
              <span className="text-muted-foreground"> · {STATUS_LABEL[p.status]} · {p.dates}</span>
            </li>
          ))}
          <li className="text-sm">
            <span className="font-semibold">3 fixes sent to livekit/agents</span>
            <span className="text-muted-foreground"> · in review · </span>
            <Link href="/#open-source" className="underline-offset-4 hover:underline">details</Link>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Stack I use in production</h2>
        <p className="text-sm text-muted-foreground">{DATA.skills.map((s) => s.name).join(" · ")}</p>
      </section>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold">Let&apos;s talk</h2>
        <p className="text-sm text-muted-foreground">
          Roles, collaborations or a voice agent that keeps breaking: <a href={`mailto:${DATA.contact.email}`} className="text-foreground underline-offset-4 hover:underline">{DATA.contact.email}</a>,
          or <a href={DATA.contact.social.LinkedIn.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline-offset-4 hover:underline">LinkedIn</a>.
        </p>
      </section>
    </main>
  );
}
