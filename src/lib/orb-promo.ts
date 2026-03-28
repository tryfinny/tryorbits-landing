/**
 * Orbits web ↔ AppsFlyer promo routing (smoke ads / landing experiments).
 *
 * For Ads + AppsFlyer OneLink setup:
 * - **Website query param:** `orb_promo` on tryorbits.com (e.g. `?orb_promo=group_chat`).
 * - **OneLink / app:** The site forwards the same value as AppsFlyer **`deep_link_value`**
 *   so install conversion and deferred deep linking expose it to the app as `promoVariant`.
 *
 * Allowed values (must match app `lib/orb-promo.ts`):
 * - `group_chat` — Orbits in group chats (reminders, events, lists).
 * - `family_chores` — Family chores inside Orbits (Tody/Sweepy-style).
 */
export const ORB_PROMO_VALUES = ["group_chat", "family_chores"] as const;

export type OrbPromoValue = (typeof ORB_PROMO_VALUES)[number];

export function isValidOrbPromo(
  value: string | null | undefined,
): value is OrbPromoValue {
  if (!value) return false;
  return (ORB_PROMO_VALUES as readonly string[]).includes(value);
}

/** Read `orb_promo` from a query string (e.g. `window.location.search`). */
export function getOrbPromoFromSearch(search: string): OrbPromoValue | null {
  const params = new URLSearchParams(
    search.startsWith("?") ? search : `?${search}`,
  );
  const raw = params.get("orb_promo");
  return isValidOrbPromo(raw) ? raw : null;
}

/** Short labels for the top banner (matches site tone). */
export function getOrbPromoBannerLabel(promo: OrbPromoValue): {
  title: string;
  hint: string;
} {
  switch (promo) {
    case "group_chat":
      return {
        title: "Let Orbits bring order to your family group chat.",
        hint: "Tap to invite Orbits to your group chat today.",
      };
    case "family_chores":
      return {
        title:
          "Get more done with Orbits family tasks. Scheduled. Reminded. Done.",
        hint: "Your family clean routine, now actually done with Orbits.",
      };
    default:
      return { title: "Get Orbits", hint: "Tap to download" };
  }
}
