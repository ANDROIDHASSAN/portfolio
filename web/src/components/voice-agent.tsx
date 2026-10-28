"use client";

import {
  BarVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useTrackToggle,
  useTrackVolume,
  useTranscriptions,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Track, type LocalAudioTrack } from "livekit-client";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { voice } from "@/components/signal-creature";

type Line = { id: string; who: "you" | "ai"; text: string; interim: boolean };

const LABEL: Record<string, string> = { listening: "Listening", thinking: "Thinking", speaking: "Speaking" };
const AGENT_JOIN_TIMEOUT_MS = 25_000; // a sleeping free-tier agent takes 10–20 s to wake up
const WAKE_S = 20; // countdown shown while it wakes: the top of LiveKit's 10–20 s cold start
const CALL_LIMIT_S = 5 * 60; // matches SESSION_LIMIT_S in portfolio/voice-agent/agent.py
const HINTS = ["What did you build at InCruiter?", "मुझे voice AI internship कैसे मिलेगी?", "मला roadmap सांगा"];

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Wakes the free-tier agent out of its 10–20 s cold start before the visitor clicks (see api/voice-token).
// ponytail: guessed 60 s between wake-ups; LiveKit doesn't say how soon an idle agent scales back to zero.
let lastWarm = 0;
function warmAgent() {
  if (Date.now() - lastWarm < 60_000) return;
  lastWarm = Date.now();
  fetch("/api/voice-token?warm", { method: "POST" }).catch(() => {});
}

/** Whole seconds since the calling component mounted. */
function useSeconds() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const t = setInterval(() => setS(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  return s;
}

// Mounted only once the agent has joined, so it counts the call itself (agent.py's limit starts at the join).
function CallClock() {
  const s = useSeconds();
  return <span className="tabular-nums">{clock(s)} / {clock(CALL_LIMIT_S)}</span>;
}

// aria-hidden: a screen reader announcing every second is noise; the status pill already says it's waking up.
function WakeCountdown() {
  const left = Math.max(0, WAKE_S - useSeconds());
  return (
    <div aria-hidden className="flex h-16 flex-col items-center justify-center">
      {left > 0 ? (
        <>
          <span className="font-mono text-4xl font-semibold tabular-nums text-foreground">{left}</span>
          <span className="text-[11px] text-muted-foreground">seconds · free servers nap when idle</span>
        </>
      ) : (
        <span className="text-sm text-muted-foreground">Almost there…</span>
      )}
    </div>
  );
}

function Transcript({ lines }: { lines: Line[] }) {
  const box = useRef<HTMLDivElement>(null);
  // Block body on purpose: scrollTo() returns a Promise in current Chrome, and an effect must not return one.
  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" });
  }, [lines]);
  return (
    <div
      ref={box}
      aria-live="polite"
      className="flex max-h-72 w-full flex-col gap-3 overflow-y-auto px-1 py-2 text-left text-sm [mask-image:linear-gradient(to_bottom,transparent,black_1.5rem)]"
    >
      {lines.map((l) =>
        l.who === "ai" ? (
          <div key={l.id} className="transcript-in max-w-[85%]">
            <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-wider text-(--viz-1)">AI Hassan</span>
            <p className="leading-relaxed text-foreground">{l.text}</p>
          </div>
        ) : (
          <div key={l.id} className="transcript-in max-w-[85%] self-end text-right">
            <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">You</span>
            <p className={`rounded-2xl rounded-tr-sm bg-muted px-3 py-2 leading-relaxed ${l.interim ? "opacity-60" : ""}`}>{l.text}</p>
          </div>
        ),
      )}
    </div>
  );
}

function CallView({ onEnd, onFail, onLines }: { onEnd: () => void; onFail: (msg: string) => void; onLines: (l: Line[]) => void }) {
  const { agent, state, audioTrack } = useVoiceAssistant();
  const { localParticipant, microphoneTrack } = useLocalParticipant();
  const mic = useTrackToggle({ source: Track.Source.Microphone });
  const agentVolume = useTrackVolume(audioTrack);
  const myVolume = useTrackVolume(microphoneTrack?.track as LocalAudioTrack | undefined);
  const transcriptions = useTranscriptions();

  const lines: Line[] = transcriptions
    .filter((t) => t.text.trim())
    .map((t) => ({
      id: t.streamInfo.id,
      who: t.participantInfo.identity === localParticipant.identity ? "you" : "ai",
      text: t.text.trim(),
      interim: t.streamInfo.attributes?.["lk.transcription_final"] === "false",
    }));
  const key = lines.map((l) => l.text).join("\n");
  useEffect(() => {
    onLines(lines);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (agent) return;
    const t = setTimeout(() => onFail("My AI clone didn't pick up. Please try again in a minute."), AGENT_JOIN_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [agent, onFail]);


  // Feed the page's signal creature: it swims to this card and moves with whoever is talking.
  useEffect(() => {
    voice.active = true;
    return () => {
      voice.active = false;
      voice.level = 0;
    };
  }, []);
  useEffect(() => {
    voice.level = Math.min(1, state === "speaking" ? agentVolume * 3 : state === "listening" ? myVolume * 2 : 0);
  }, [state, agentVolume, myVolume]);

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      <div className="flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted-foreground">
        <span className={`size-1.5 rounded-full ${agent ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`} />
        <span className="text-foreground" aria-live="polite">{agent ? LABEL[state] ?? "Connecting" : "Waking up my AI…"}</span>
        {agent && (
          <>
            <span aria-hidden>·</span>
            <CallClock />
          </>
        )}
      </div>
      {agent ? (
        <BarVisualizer
          state={state}
          track={audioTrack}
          barCount={9}
          options={{ minHeight: 10 }}
          className="flex h-16 w-56 items-center justify-center gap-1.5 [&>.lk-audio-bar]:w-2.5 [&>.lk-audio-bar]:rounded-full [&>.lk-audio-bar]:bg-muted-foreground/25 [&>.lk-audio-bar]:transition-colors [&>.lk-audio-bar[data-lk-highlighted=true]]:bg-(--viz-1)"
        />
      ) : (
        <WakeCountdown />
      )}
      {lines.length ? (
        <Transcript lines={lines} />
      ) : (
        <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
          <span className="w-full">Say hi, or try:</span>
          {HINTS.map((h) => (
            <span key={h} className="rounded-full border border-dashed border-border px-3 py-1">&ldquo;{h}&rdquo;</span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => mic.toggle()}
          aria-pressed={!mic.enabled}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted cursor-pointer"
        >
          {mic.enabled ? <Mic className="size-4" /> : <MicOff className="size-4 text-red-500" />}
          {mic.enabled ? "Mute" : "Unmute"}
        </button>
        <button
          type="button"
          onClick={onEnd}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 cursor-pointer"
        >
          <PhoneOff className="size-4" /> End call
        </button>
      </div>
    </div>
  );
}

/** "Talk to my AI": fetches a token, joins a fresh LiveKit room and lets the agent take it from there. */
export function VoiceAgent({ enabled }: { enabled: boolean }) {
  const [conn, setConn] = useState<{ serverUrl: string; token: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lines, setLines] = useState<Line[]>([]); // kept after the call so the visitor can read it back
  const fail = useCallback((msg: string) => {
    setError(msg);
    setConn(null);
  }, []);
  useEffect(() => {
    if (enabled) warmAgent();
  }, [enabled]);

  async function start() {
    setBusy(true);
    setError(null);
    setLines([]);
    try {
      const res = await fetch("/api/voice-token", { method: "POST" });
      const body = res.headers.get("content-type")?.includes("json") ? await res.json() : {};
      if (!res.ok) throw new Error(body.error ?? "Could not start the call.");
      setConn(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the call.");
    } finally {
      setBusy(false);
    }
  }

  if (conn) {
    return (
      <LiveKitRoom
        serverUrl={conn.serverUrl}
        token={conn.token}
        connect
        audio={{ echoCancellation: true, noiseSuppression: true, autoGainControl: true }}
        video={false}
        onDisconnected={() => setConn(null)}
        onError={() => fail("Couldn't connect to the call. Check your network and try again.")}
        onMediaDeviceFailure={() => fail("I need microphone access to hear you. Allow it in your browser and try again.")}
        className="w-full flex justify-center"
      >
        <RoomAudioRenderer />
        <CallView onEnd={() => setConn(null)} onFail={fail} onLines={setLines} />
      </LiveKitRoom>
    );
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-3">
      {lines.length > 0 && (
        <>
          <span className="font-mono text-[11px] text-muted-foreground">Call ended · your transcript</span>
          <Transcript lines={lines} />
        </>
      )}
      <button
        type="button"
        onClick={start}
        onPointerEnter={enabled ? warmAgent : undefined}
        onFocus={enabled ? warmAgent : undefined}
        disabled={!enabled || busy}
        className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        <span className="relative flex size-2.5">
          {enabled && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
          <span className={`relative inline-flex size-2.5 rounded-full ${enabled ? "bg-emerald-500" : "bg-muted-foreground"}`} />
        </span>
        <Mic className="size-4" />
        {!enabled ? "Voice agent coming soon" : busy ? "Calling…" : lines.length ? "Talk again" : "Talk to my AI"}
      </button>
      {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
    </div>
  );
}
