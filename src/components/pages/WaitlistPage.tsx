import { useEffect, useMemo, useState } from "react";
import { initAnalytics, trackWaitlistInterest } from "@/lib/analytics";
import { AppStoreButtons } from "@/components/landing/AppStoreButtons";
import { getOrbPromoWaitlistCopy, isValidOrbPromo, ORB_PROMO_CPP_IDS } from "@/lib/orb-promo";

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

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

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
      email_source: params.email ? "url" : "none",
    });
  }, [params]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(null);
    trackWaitlistInterest({
      feature: params.feature,
      source: params.source || undefined,
      campaign: params.campaign || undefined,
      email,
      email_source: "user_input",
    });
    setSubmittedEmail(email);
  };

  if (!params.feature) return null;

  const copy = isValidOrbPromo(params.feature)
    ? getOrbPromoWaitlistCopy(params.feature)
    : DEFAULT_COPY;

  const isSms = params.feature === "sms";
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxSrc(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxSrc]);

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
                  className="w-full h-auto rounded-lg cursor-zoom-in"
                  onClick={() => setLightboxSrc("/waitlist/sms-before.png")}
                />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground">
                  After
                </p>
                <img
                  src="/waitlist/sms-after.png"
                  alt="The same group chat with Bit organizing reminders, lists, and addresses"
                  className="w-full h-auto rounded-lg cursor-zoom-in"
                  onClick={() => setLightboxSrc("/waitlist/sms-after.png")}
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
          {(params.email || submittedEmail) ? (
            <p
              className={`text-muted-foreground leading-snug ${
                isSms ? "text-sm" : "text-base leading-relaxed"
              }`}
            >
              <span className="font-semibold text-foreground">You're on the list.</span>{" "}
              {isSms
                ? "Get the app to find out when it's your turn."
                : "We'll email you when it's your turn. In the meantime, explore everything else Orbits can do for your home — get the app below."}
            </p>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
              <label
                htmlFor="waitlist-email"
                className={`leading-snug ${
                  isSms ? "text-sm" : "text-base leading-relaxed"
                }`}
              >
                <span className="text-muted-foreground">
                  Drop your email below and we'll let you know when it's your turn.
                </span>
              </label>
              <input
                id="waitlist-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#1a1a1a] px-6 py-4 text-base font-bold text-white shadow-sm hover:opacity-90 active:scale-[0.99] transition"
              >
                Notify me
              </button>
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
            </form>
          )}
        </div>

        {(params.email || submittedEmail) && (
          <div className={`flex justify-center ${isSms ? "mt-3" : "mt-8"}`}>
            <AppStoreButtons
              location="waitlist_page"
              oneLinkParams={
                isValidOrbPromo(params.feature) && ORB_PROMO_CPP_IDS[params.feature]
                  ? {
                      deep_link_value: params.feature,
                      af_ios_store_cpp: ORB_PROMO_CPP_IDS[params.feature]!,
                    }
                  : undefined
              }
            />
          </div>
        )}
      </div>

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={lightboxSrc}
            alt=""
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}
    </section>
  );
}
