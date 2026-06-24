"use client";
import { useEffect, useState } from "react";
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
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [questions, setQuestions] = useState<Questions | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [paywall, setPaywall] = useState<{ open: boolean; action: ActionType | null }>({ open: false, action: null });

  useEffect(() => {
    initAnalytics();
    trackDemoStarted();
  }, []);

  const handlePrompt = async (p: string) => {
    setPrompt(p);
    setDir("fwd");
    trackPromptSubmitted(p);
    setLoading(true);
    const data = (await withMinDelay(callPlan({ mode: "questions", prompt: p }), MIN_LOADER_MS)) as Questions;
    setQuestions(data);
    setLoading(false);
    setStep("questions");
    trackQuestionsShown(data.fields.length);
  };

  const handleAnswers = async (answers: Record<string, string>) => {
    setDir("fwd");
    trackAnswersSubmitted(Object.keys(answers).length);
    setLoading(true);
    const data = (await withMinDelay(callPlan({ mode: "cards", prompt, answers }), MIN_LOADER_MS)) as Cards;
    setCards(data.cards);
    setLoading(false);
    setStep("cards");
    trackCardsShown(data.cards.map((c) => c.type));
    // Generate a relevant hero image in the background (non-blocking).
    setHeroUrl(null);
    callPlan({ mode: "hero", prompt, title: questions?.title ?? prompt })
      .then((r) => setHeroUrl(r?.image ?? null))
      .catch(() => {});
  };

  const handleAction = (action: ActionType) => {
    trackActionChipTapped(action);
    setPaywall({ open: true, action });
  };

  const handleBack = () => {
    setDir("back");
    setStep("intro");
    setCards([]);
    setHeroUrl(null);
    setQuestions(null);
    setPrompt("");
  };

  return (
    <PhoneFrame>
      <div
        key={loading ? "loading" : step}
        className={`flex min-h-0 flex-1 flex-col duration-300 ease-out animate-in fade-in ${
          dir === "back" ? "slide-in-from-left-8" : "slide-in-from-right-8"
        }`}
      >
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <ThinkingLoader />
          </div>
        ) : step === "intro" ? (
          <IntroScreen onSubmit={handlePrompt} />
        ) : step === "questions" && questions ? (
          <QuestionsForm questions={questions} onSubmit={handleAnswers} />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <CardsView cards={cards} title={questions?.title ?? "Your Plan"} heroUrl={heroUrl} onAction={handleAction} onBack={handleBack} />
          </div>
        )}
      </div>

      <PaywallModal
        open={paywall.open}
        action={paywall.action}
        onClose={() => setPaywall({ open: false, action: null })}
      />
    </PhoneFrame>
  );
}
