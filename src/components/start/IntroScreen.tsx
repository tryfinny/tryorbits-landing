"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { BitAvatar } from "./BitAvatar";
import { CtaButton } from "./CtaButton";

const SUGGESTIONS: { label: string; prompt: string }[] = [
  { label: "Birthday party", prompt: "Plan a 7th birthday party for my daughter this Saturday afternoon for 12 kids" },
  { label: "Weekend getaway", prompt: "Plan a weekend getaway in San Francisco for my wife and I next month" },
  { label: "Dinner party", prompt: "Plan a dinner party for 8 friends at my place this Friday at 7pm" },
  { label: "Baby shower", prompt: "Plan a baby shower for my sister next Sunday afternoon for 15 guests" },
  { label: "Game night", prompt: "Plan a game night for 6 friends this Friday at 8pm" },
  { label: "Camping trip", prompt: "Plan a weekend camping trip in Yosemite for 4 friends next month" },
];

export function IntroScreen({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();

  return (
    <div className="flex flex-1 flex-col px-6 pt-12 pb-6">
      <div className="flex flex-1 flex-col justify-center">
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
                className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-sage-foreground transition hover:brightness-95"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6">
        <CtaButton disabled={trimmed.length === 0} onClick={() => onSubmit(trimmed)}>
          Send
        </CtaButton>
      </div>
    </div>
  );
}
