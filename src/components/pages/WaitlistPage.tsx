import { useEffect, useMemo } from "react";
import { initAnalytics, trackWaitlistInterest } from "@/lib/analytics";
import { CheckCircle2 } from "lucide-react";

const FEATURE_COPY: Record<string, { title: string; description: string }> = {
  sms: {
    title: "Your assistant, over text",
    description:
      "We're slowly rolling out Bit over SMS. Text Bit directly or add Bit to your group chat. Bit will automatically pick up any reminders, events, grocery list items, and more. We'll let you know once this launches in your region.",
  },
};

const DEFAULT_COPY = {
  title: "Something new is coming",
  description:
    "We're working on something exciting and rolling it out gradually. We'll let you know once it's ready for you.",
};

export default function WaitlistPage() {
  const params = useMemo(() => {
    if (typeof window === "undefined") return { feature: "", source: "", campaign: "", email: "" };
    const sp = new URLSearchParams(window.location.search);
    return {
      feature: sp.get("feature") || "",
      source: sp.get("utm_source") || "",
      campaign: sp.get("utm_campaign") || "",
      email: sp.get("email") || "",
    };
  }, []);

  useEffect(() => {
    if (!params.feature) {
      window.location.replace("/");
      return;
    }

    initAnalytics();
    trackWaitlistInterest({
      feature: params.feature,
      source: params.source || undefined,
      campaign: params.campaign || undefined,
      email: params.email || undefined,
    });
  }, [params]);

  if (!params.feature) return null;

  const copy = FEATURE_COPY[params.feature] || DEFAULT_COPY;

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-3xl font-bold mb-3 tracking-tight">{copy.title}</h1>

        <p className="text-muted-foreground text-base leading-relaxed mb-8">
          {copy.description}
        </p>

        <div className="rounded-2xl border border-border/50 bg-card p-5 text-left">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">You're on the list.</span>{" "}
            We'll send you an email when it's your turn. In the meantime, make sure you have the latest version of Orbits.
          </p>
        </div>

        <a
          href="/"
          className="inline-block mt-8 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
        >
          &larr; Back to Orbits
        </a>
      </div>
    </section>
  );
}
