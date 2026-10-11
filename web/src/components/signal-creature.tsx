"use client";

import { useEffect, useRef } from "react";

/** Written by voice-agent.tsx during a call: who is talking and how loud (0..1). The creature reads it every frame. */
export const voice = { active: false, level: 0 };

const SEGMENTS = 34;
const GAP = 7; // px between body points
const IDLE_MS = 4000; // cursor still this long: wander on its own

/**
 * A little signal that lives on the page: a waveform-bodied creature that swims after the cursor,
 * gets "louder" the faster it moves, pings sound rings on click, and during a voice call swims to
 * the call card and moves with the real voice.
 */
export function SignalCreature() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const body = Array.from({ length: SEGMENTS }, () => ({ x: innerWidth * 0.8, y: 140 }));
    const target = { x: innerWidth * 0.8, y: 140 };
    const pings: { x: number; y: number; at: number }[] = [];
    let colors = ["", ""];
    let lastMove = -IDLE_MS;
    let level = 0;
    let raf = 0;

    const readColors = () => {
      const css = getComputedStyle(document.documentElement);
      colors = [css.getPropertyValue("--viz-1").trim(), css.getPropertyValue("--viz-2").trim()];
    };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      lastMove = performance.now();
    };
    const onDown = (e: PointerEvent) => pings.push({ x: e.clientX, y: e.clientY, at: performance.now() });

    // One wave along the body: offset each point along its normal by a travelling sine.
    const wave = (t: number, amp: number, phase: number) => {
      ctx.beginPath();
      body.forEach((p, i) => {
        const a = body[Math.max(i - 1, 0)], b = body[Math.min(i + 1, SEGMENTS - 1)];
        const normal = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2;
        const off = amp * Math.sin(Math.PI * (i / (SEGMENTS - 1))) * Math.sin(t * 7 - i * 0.75 + phase);
        const x = p.x + Math.cos(normal) * off, y = p.y + Math.sin(normal) * off;
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
    };

    const frame = (now: number) => {
      const t = now / 1000;
      const talk = voice.active ? document.getElementById("talk")?.getBoundingClientRect() : undefined;
      if (talk && talk.bottom > 0 && talk.top < innerHeight) {
        // In a call: hover beside the call card's top-right corner.
        target.x = Math.min(talk.right - 40, innerWidth - 40) + 10 * Math.sin(t);
        target.y = Math.max(talk.top + 40, 40) + 8 * Math.sin(t * 1.3);
      } else if (now - lastMove > IDLE_MS) {
        target.x = innerWidth * (0.78 + 0.12 * Math.sin(t * 0.25));
        target.y = 150 + 70 * Math.sin(t * 0.5);
      }

      const head = body[0];
      const dx = (target.x - head.x) * 0.07, dy = (target.y - head.y) * 0.07;
      head.x += dx;
      head.y += dy;
      for (let i = 1; i < SEGMENTS; i++) {
        const a = body[i - 1], p = body[i];
        const ang = Math.atan2(p.y - a.y, p.x - a.x);
        p.x = a.x + Math.cos(ang) * GAP;
        p.y = a.y + Math.sin(ang) * GAP;
      }

      level += (voice.level - level) * 0.25;
      const amp = 3 + Math.min(Math.hypot(dx, dy), 12) * 0.6 + level * 16;

      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.75;
      ctx.strokeStyle = colors[0];
      wave(t, amp, 0);
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = colors[1];
      wave(t, amp * 0.7, Math.PI);

      // Head: a dot with a ring that breathes, and swells with the voice.
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 7 + 1.5 * Math.sin(t * 3) + level * 10, 0, Math.PI * 2);
      ctx.stroke();

      // Click pings: three sound rings that expand and fade over 900 ms.
      ctx.strokeStyle = colors[1];
      while (pings.length && now - pings[0].at > 900) pings.shift();
      for (const p of pings) {
        for (let k = 0; k < 3; k++) {
          const age = (now - p.at) / 900 - k * 0.15;
          if (age <= 0) continue;
          ctx.globalAlpha = 0.5 * (1 - age);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 6 + age * 38, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(frame);
    };

    readColors();
    resize();
    const themeWatch = new MutationObserver(readColors); // next-themes toggles the class on <html>
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    addEventListener("resize", resize);
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      themeWatch.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-30 h-full w-full print:hidden" />;
}
