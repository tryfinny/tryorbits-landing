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
    <div className="flex flex-1 flex-col px-5 pt-6 pb-5">
      <p className="text-center text-[1.875rem] font-bold leading-tight tracking-tight text-foreground">
        Welcome to Orbits
      </p>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <BitAvatar size={168} src="/bit-idle.gif" />
        <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-foreground">
          I&apos;m Bit. What can I help you with?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Other assistants just tell you what to do. I actually do it — I&apos;ll make the
          calls, send the texts, and place the orders for you. Go on, give me a try!
        </p>
      </div>

      {/* composer: textarea on top; chips + send share the bottom row */}
      <div className="rounded-3xl border border-border bg-card px-2.5 pb-2.5 pt-1 shadow-sm">
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
          className="w-full resize-none border-0 bg-transparent px-2 pt-3 text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 [mask-image:linear-gradient(to_right,#000_90%,transparent)] [&::-webkit-scrollbar]:hidden">
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
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
              trimmed
                ? "bg-[hsl(97_17%_42%)] text-white hover:bg-[hsl(97_20%_37%)]"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            <ArrowUp className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
