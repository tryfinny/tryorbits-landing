"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { Questions, Cards, Card, ActionType } from "@/lib/start/schemas";
import { PhoneFrame } from "./PhoneFrame";
import { ThinkingLoader } from "./ThinkingLoader";
import { IntroScreen } from "./IntroScreen";
import { QuestionsForm } from "./QuestionsForm";
import { CardsView } from "./CardsView";
import { PaywallModal } from "./PaywallModal";
import {
  initAnalytics, trackDemoStarted, trackPromptSubmitted, trackQuestionsShown,
  trackAnswersSubmitted, trackCardsShown, trackActionChipTapped,
} from "@/lib/analytics";

const MIN_LOADER_MS = 900;

async function withMinDelay<T>(p: Promise<T>, ms: number): Promise<T> {
  const [res] = await Promise.all([p, new Promise((r) => setTimeout(r, ms))]);
  return res;
}

async function callPlan(body: Record<string, unknown>) {
  const res = await fetch("/api/plan", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export function DemoFlow() {
  const [step, setStep] = useState<"intro" | "questions" | "cards">("intro");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState<Questions | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [paywall, setPaywall] = useState<{ open: boolean; action: ActionType | null }>({ open: false, action: null });

  useEffect(() => {
    initAnalytics();
    trackDemoStarted();
  }, []);

  const handlePrompt = async (p: string) => {
    setPrompt(p);
    trackPromptSubmitted(p);
    setLoading(true);
    const data = (await withMinDelay(callPlan({ mode: "questions", prompt: p }), MIN_LOADER_MS)) as Questions;
    setQuestions(data);
    setLoading(false);
    setStep("questions");
    trackQuestionsShown(data.fields.length);
  };

  const handleAnswers = async (answers: Record<string, string>) => {
    trackAnswersSubmitted(Object.keys(answers).length);
    setLoading(true);
    const data = (await withMinDelay(callPlan({ mode: "cards", prompt, answers }), MIN_LOADER_MS)) as Cards;
    setCards(data.cards);
    setLoading(false);
    setStep("cards");
    trackCardsShown(data.cards.map((c) => c.type));
  };

  const handleAction = (action: ActionType) => {
    trackActionChipTapped(action);
    setPaywall({ open: true, action });
  };

  return (
    <PhoneFrame>
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <ThinkingLoader />
        </div>
      ) : step === "intro" ? (
        <IntroScreen onSubmit={handlePrompt} />
      ) : step === "questions" && questions ? (
        <QuestionsForm questions={questions} onSubmit={handleAnswers} />
      ) : (
        <div className="relative flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <CardsView cards={cards} title={questions?.title ?? "Your Plan"} onAction={handleAction} />
          </div>
          <div className="pointer-events-none absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg">
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </div>
        </div>
      )}

      <PaywallModal
        open={paywall.open}
        action={paywall.action}
        onClose={() => setPaywall({ open: false, action: null })}
      />
    </PhoneFrame>
  );
}
