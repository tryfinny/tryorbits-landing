import { useEffect, useMemo } from "react";
import { initAnalytics, trackWaitlistInterest, getOneLinkUrl } from "@/lib/analytics";

const FEATURE_COPY: Record<string, { title: string; subtitle: string; description: string }> = {
  sms: {
    title: "Your assistant, over text",
    subtitle: "We're slowly rolling out Bit over text.",
    description:
      "Text Bit directly or add Bit to your group chat. Bit will automatically pick up any reminders, events, grocery list items, and more. We'll let you know once this launches in your region.",
  },
};

const DEFAULT_COPY = {
  title: "Something new is coming",
  subtitle: "We're rolling this out gradually.",
  description:
    "We're working on something exciting. We'll let you know once it's ready for you.",
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
        <img
          src="/orbits-banner.png"
          alt="Orbits"
          className="mx-auto mb-8"
          style={{ maxWidth: 160 }}
        />

        <img
          src="/bit-happy.gif"
          alt="Bit"
          className="mx-auto mb-6"
          style={{ width: 140, height: 'auto' }}
        />

        <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ fontFamily: 'var(--font-sans)' }}>{copy.title}</h1>

        <p className="text-muted-foreground text-base font-medium mb-4">
          {copy.subtitle}
        </p>

        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          {copy.description}
        </p>

        <div className="rounded-2xl border border-border/50 bg-card p-5 text-left">
          <p className="text-base text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">You're on the list.</span>{" "}
            We'll send you an email when it's your turn. In the meantime, make sure you have the latest version of Orbits.
          </p>
        </div>

        <a
          href={getOneLinkUrl({ af_sub4: 'waitlist_page' })}
          className="inline-flex items-center justify-center mt-8 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Get Orbits
        </a>
      </div>
    </section>
  );
}
