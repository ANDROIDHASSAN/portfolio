"use client";

import { cn } from "@/lib/utils";
import { useRef, type ReactNode } from "react";

/** A soft glow that follows the cursor across a card. Pure CSS variables, no re-renders. */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn("group/spot relative", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100 motion-reduce:hidden"
        style={{
          background: "radial-gradient(320px circle at var(--x) var(--y), color-mix(in oklch, var(--viz-1) 14%, transparent), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
