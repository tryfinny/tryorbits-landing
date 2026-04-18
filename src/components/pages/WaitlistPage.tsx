import { useEffect, useMemo } from "react";
import { initAnalytics, trackWaitlistInterest } from "@/lib/analytics";
import { AppStoreButtons } from "@/components/landing/AppStoreButtons";
import { getOrbPromoWaitlistCopy, isValidOrbPromo } from "@/lib/orb-promo";

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

  const copy = isValidOrbPromo(params.feature)
    ? getOrbPromoWaitlistCopy(params.feature)
    : DEFAULT_COPY;

  const isSms = params.feature === "sms";

  return (
    <section
      className={`min-h-screen flex items-center justify-center px-6 ${
        isSms ? "py-4 sm:py-6" : "py-20"
      }`}
    >
      <div className="max-w-md w-full text-center">
        <img
          src="/orbits-banner.png"
          alt="Orbits"
          className={`mx-auto ${isSms ? "mb-3" : "mb-8"}`}
          style={{ maxWidth: isSms ? 110 : 160 }}
        />

        <img
          src="/bit-happy.gif"
          alt="Bit"
          className={`mx-auto ${isSms ? "mb-3" : "mb-6"}`}
          style={{ width: isSms ? 90 : 140, height: "auto" }}
        />

        {isSms && (
          <>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              The family group chat needs an upgrade.
            </h2>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Before
                </p>
                <img
                  src="/waitlist/sms-before.png"
                  alt="A chaotic family group chat in iMessage"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
                  After
                </p>
                <img
                  src="/waitlist/sms-after.png"
                  alt="The same group chat with Bit organizing reminders, lists, and addresses"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </>
        )}

        {!isSms && (
          <h1
            className="text-3xl font-bold mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {copy.title}
          </h1>
        )}

        <p
          className={`text-muted-foreground font-medium ${
            isSms ? "text-sm mb-3" : "text-base mb-4"
          }`}
        >
          {copy.subtitle}
        </p>

        {!isSms && (
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            {copy.description}
          </p>
        )}

        <div
          className={`rounded-xl border border-border/50 bg-card text-left ${
            isSms ? "p-3" : "p-5"
          }`}
        >
          <p
            className={`text-muted-foreground leading-snug ${
              isSms ? "text-sm" : "text-base leading-relaxed"
            }`}
          >
            <span className="font-semibold text-foreground">You're on the list.</span>{" "}
            {isSms
              ? "Get the app to find out when it's your turn."
              : "We'll send you an email when it's your turn. In the meantime, make sure you have the latest version of Orbits."}
          </p>
        </div>

        <div className={`flex justify-center ${isSms ? "mt-3" : "mt-8"}`}>
          <AppStoreButtons location="waitlist_page" />
        </div>
      </div>
    </section>
  );
}
