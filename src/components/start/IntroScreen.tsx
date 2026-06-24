"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BitAvatar } from "./BitAvatar";

const SUGGESTION = "Plan a birthday party for my daughter";

export function IntroScreen({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();

  return (
    <div className="flex flex-1 flex-col px-5 pt-12 pb-6">
      <div className="flex items-center gap-3">
        <BitAvatar size={64} />
        <div>
          <p className="text-sm text-muted-foreground">Bit</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">What can I help you with?</h1>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setValue(SUGGESTION)}
          className="self-start rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          {SUGGESTION}
        </button>

        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type what you need help with…"
          rows={4}
          className="resize-none text-base"
        />

        <Button
          size="lg"
          disabled={trimmed.length === 0}
          onClick={() => onSubmit(trimmed)}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
