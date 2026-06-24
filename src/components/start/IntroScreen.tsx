"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { BitAvatar } from "./BitAvatar";
import { CtaButton } from "./CtaButton";

const SUGGESTIONS: { label: string; prompt: string }[] = [
  { label: "Birthday party", prompt: "Plan a birthday party for my daughter" },
  { label: "Weekend trip", prompt: "Plan a weekend getaway" },
  { label: "Dinner party", prompt: "Plan a dinner party for 8 friends" },
];

export function IntroScreen({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <BitAvatar size={112} />
        <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-tight text-foreground">
          What can I help you with?
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Tell Bit a task and watch it get handled.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Plan a birthday party for my daughter…"
          rows={3}
          className="resize-none rounded-2xl border-border bg-card text-lg shadow-sm"
        />

        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setValue(s.prompt)}
              className="rounded-full border border-[hsl(96_20%_82%)] bg-[hsl(96_26%_91%)] px-4 py-2 text-sm font-semibold text-[hsl(96_32%_28%)] transition-colors hover:bg-[hsl(96_26%_86%)]"
            >
              {s.label}
            </button>
          ))}
        </div>

        <CtaButton disabled={trimmed.length === 0} onClick={() => onSubmit(trimmed)}>
          Send
        </CtaButton>
      </div>
    </div>
  );
}
