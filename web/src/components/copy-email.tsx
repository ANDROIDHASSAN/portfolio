"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copies the email address and confirms it in place for two seconds. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.location.href = `mailto:${email}`;
        }
      }}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted cursor-pointer"
      aria-live="polite"
    >
      {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
      {copied ? "Copied!" : "Copy email"}
    </button>
  );
}
