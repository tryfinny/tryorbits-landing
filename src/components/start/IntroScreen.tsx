"use client";
import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { BitAvatar } from "./BitAvatar";

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
  const send = () => trimmed && onSubmit(trimmed);

  return (
    <div className="flex flex-1 flex-col px-5 pt-12 pb-5">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <BitAvatar size={112} />
        <h1 className="mt-4 text-[2rem] font-bold leading-tight tracking-tight text-foreground">
          What can I help you with?
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Tell Bit a task and watch it get handled.
        </p>
      </div>

      {/* composer: textarea + scrollable chips + small send button, all in one box */}
      <div className="rounded-3xl border border-border bg-card shadow-sm">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="e.g. Plan a birthday party for my daughter…"
          rows={2}
          className="resize-none border-0 bg-transparent px-4 pt-4 text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <div className="flex items-center gap-2 px-2.5 pb-2.5 pt-1">
          <div className="flex flex-1 gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setValue(s.prompt)}
                className="shrink-0 whitespace-nowrap rounded-full border border-border bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:brightness-95"
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={send}
            disabled={!trimmed}
            aria-label="Send"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
              trimmed
                ? "bg-[hsl(97_17%_42%)] text-white hover:bg-[hsl(97_20%_37%)]"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
