import { useEffect, useMemo, useRef } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import {
  getOrbPromoBannerLabel,
  getOrbPromoFromSearch,
  type OrbPromoValue,
} from "@/lib/orb-promo";
import {
  trackPromoBannerClicked,
  trackPromoBannerShown,
} from "@/lib/analytics";

export function PromoTopBanner() {
  const trackedShown = useRef(false);

  const promo = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getOrbPromoFromSearch(window.location.search);
  }, []);

  const installHref = useMemo(() => {
    if (typeof window === "undefined") return "/install";
    const search = window.location.search;
    return search ? `/install${search}` : "/install";
  }, []);

  const pagePath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    if (!promo || trackedShown.current) return;
    trackedShown.current = true;
    trackPromoBannerShown({
      promo_variant: promo,
      page_path: pagePath,
    });
  }, [promo, pagePath]);

  if (!promo) return null;

  const { title, hint } = getOrbPromoBannerLabel(promo);

  return (
    <aside className="w-full border-b border-primary/10 bg-gradient-to-r from-secondary/40 via-background to-secondary/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <a
          href={installHref}
          className="flex min-h-[52px] items-center justify-center gap-3 py-3 sm:min-h-[56px] sm:py-3.5 transition-opacity hover:opacity-90 active:opacity-80"
          onClick={() =>
            trackPromoBannerClicked({
              promo_variant: promo,
              page_path: pagePath,
            })
          }
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-card/80 shadow-sm">
            <Sparkles className="h-4 w-4 text-golden" aria-hidden />
          </span>
          <span className="min-w-0 flex-1 text-center sm:text-left">
            <span className="block font-serif text-base font-medium tracking-[-0.01em] text-foreground sm:text-lg">
              {title}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground sm:text-sm">
              {hint}
            </span>
          </span>
          <ChevronRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
        </a>
      </div>
    </aside>
  );
}
