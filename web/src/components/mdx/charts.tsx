/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";

// Chart colours: --viz-1 (blue) and --viz-2 (teal), defined per theme in globals.css and
// validated with the dataviz palette checker. Text always uses text tokens, never series colours.

function Figure({ title, caption, children }: { title: string; caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="not-prose my-8 rounded-xl border border-border bg-card p-5">
      <div className="mb-4 text-sm font-semibold text-foreground">{title}</div>
      {children}
      <figcaption className="mt-4 text-xs leading-relaxed text-muted-foreground">{caption}</figcaption>
    </figure>
  );
}

/** One Devanagari reply scored against an English-only guard's pass threshold. */
export function GuardScoreChart() {
  const score = 0.39;
  const threshold = 0.5;
  return (
    <Figure
      title="English-only text guard vs a Devanagari reply"
      caption="Match score 0.39 against a pass threshold of 0.50, so the guard failed a Devanagari reply. Scale 0 to 1."
    >
      <div className="relative h-24">
        <div className="absolute inset-x-0 top-9 h-7 rounded-md bg-muted" aria-hidden />
        <div
          className="absolute left-0 top-9 h-7 rounded-md bg-(--viz-1)"
          style={{ width: `${score * 100}%` }}
          title={`Match score: ${score}`}
        />
        <span className="absolute top-9 flex h-7 items-center pl-3 text-xs font-semibold text-white">0.39 match</span>
        <div className="absolute top-5 bottom-3 border-l-2 border-dashed border-foreground" style={{ left: `${threshold * 100}%` }} />
        <span className="absolute top-0 -translate-x-1/2 text-xs font-medium text-foreground" style={{ left: `${threshold * 100}%` }}>
          threshold 0.50
        </span>
        <span className="absolute bottom-0 left-0 text-[11px] text-muted-foreground">0</span>
        <span className="absolute bottom-0 right-0 text-[11px] text-muted-foreground">1.0</span>
        <span className="absolute top-9 right-0 flex h-7 items-center pr-3 text-xs font-semibold text-foreground">✕ guard fails</span>
      </div>
    </Figure>
  );
}

/** 15 Marathi turns, 10 hallucinated. Grouped by outcome, not shown in turn order. */
export function TurnWaffle() {
  const total = 15;
  const bad = 10;
  return (
    <Figure
      title="Marathi STT: 10 of 15 turns hallucinated"
      caption="Each square is one Marathi turn, grouped by outcome (not in turn order). Squares marked ✕ came back as hallucinated text."
    >
      <div className="flex flex-wrap gap-1.5" role="img" aria-label="10 of 15 turns hallucinated, 5 transcribed correctly">
        {Array.from({ length: total }, (_, i) => {
          const isBad = i < bad;
          return (
            <span
              key={i}
              title={`Turn ${i + 1}: ${isBad ? "hallucinated" : "transcribed correctly"}`}
              className={`grid size-9 place-items-center rounded-md text-sm font-semibold text-white ${isBad ? "bg-(--viz-1)" : "bg-(--viz-2)"}`}
            >
              {isBad ? "✕" : "✓"}
            </span>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-(--viz-1)" />✕ hallucinated · 10</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-(--viz-2)" />✓ correct · 5</span>
      </div>
    </Figure>
  );
}

/** Reply latency on phone calls: Hindi vs English. */
export function ReplyLatencyChart() {
  const rows = [
    { label: "Hindi", value: 5, cls: "bg-(--viz-1)" },
    { label: "English", value: 2, cls: "bg-(--viz-2)" },
  ];
  const max = 6;
  return (
    <Figure
      title="Time until the agent starts replying, on phone calls"
      caption="Approximate: Hindi replies took about 5 s against about 2 s in English on screening calls. Scale 0 to 6 s."
    >
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[64px_1fr] items-center gap-3">
            <span className="text-sm font-medium text-foreground">{r.label}</span>
            <div className="relative h-7 rounded-md bg-muted">
              <div className={`h-7 rounded-md ${r.cls}`} style={{ width: `${(r.value / max) * 100}%` }} title={`${r.label}: ~${r.value} s`} />
              <span className="absolute inset-y-0 flex items-center pl-2 text-xs font-semibold text-foreground" style={{ left: `${(r.value / max) * 100}%` }}>
                ~{r.value} s
              </span>
            </div>
          </div>
        ))}
        <div className="grid grid-cols-[64px_1fr] gap-3 text-[11px] text-muted-foreground">
          <span />
          <div className="flex justify-between"><span>0 s</span><span>3 s</span><span>6 s</span></div>
        </div>
      </div>
    </Figure>
  );
}

const STAGES = [
  { k: "Caller", sub: "phone / browser" },
  { k: "VAD + turn", sub: "who is speaking?", fail: 4 },
  { k: "STT", sub: "speech → text", fail: 2 },
  { k: "Guards", sub: "text checks", fail: 1 },
  { k: "LLM", sub: "reply + tools" },
  { k: "TTS", sub: "text → speech" },
];

/** Where each failure mode lives in a cascaded voice agent. */
export function PipelineFlow() {
  return (
    <Figure
      title="Where each failure lives in a voice agent pipeline"
      caption="① guards that only read English, ② STT hallucinating on Marathi, ③ latency that compounds across every stage, ④ turn-taking that cuts people off."
    >
      <div className="flex flex-wrap items-center gap-2">
        {STAGES.map((s, i) => (
          <div key={s.k} className="flex items-center gap-2">
            <div className={`relative rounded-lg border px-3 py-2 ${s.fail ? "border-(--viz-1) bg-(--viz-1)/10" : "border-border bg-background"}`}>
              {s.fail && (
                <span className="absolute -top-2.5 -right-2.5 grid size-5 place-items-center rounded-full bg-(--viz-1) text-[10px] font-bold text-white">
                  {"①②③④"[s.fail - 1]}
                </span>
              )}
              <div className="font-mono text-xs font-semibold text-foreground">{s.k}</div>
              <div className="text-[11px] text-muted-foreground">{s.sub}</div>
            </div>
            {i < STAGES.length - 1 && <span className="text-muted-foreground" aria-hidden>→</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-lg border border-dashed border-(--viz-1) px-3 py-2 text-xs text-foreground">
        <span className="mr-1 inline-grid size-5 place-items-center rounded-full bg-(--viz-1) text-[10px] font-bold text-white">③</span>
        Latency is not one stage: every hop above adds to the time before the caller hears a reply.
      </div>
    </Figure>
  );
}

/** Theme-paired diagram (light + dark SVG files in /public/diagrams). */
export function Diagram({ name, alt, caption }: { name: string; alt: string; caption?: string }) {
  return (
    <figure className="not-prose my-8">
      <img src={`/diagrams/${name}-light.svg`} alt={alt} className="w-full h-auto rounded-xl dark:hidden" loading="lazy" />
      <img src={`/diagrams/${name}-dark.svg`} alt={alt} className="w-full h-auto rounded-xl hidden dark:block" loading="lazy" />
      {caption && <figcaption className="mt-3 text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}

export function Callout({ children, tone = "note" }: { children: ReactNode; tone?: "note" | "target" }) {
  return (
    <div
      className={`not-prose my-6 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
        tone === "target" ? "border-dashed border-(--viz-1) bg-(--viz-1)/5 text-foreground" : "border-border bg-muted/40 text-foreground"
      }`}
    >
      {children}
    </div>
  );
}
