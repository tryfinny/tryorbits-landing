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
 * - `instacart` — Instacart grocery ordering promo ($20 off first order).
 */
export const ORB_PROMO_VALUES = ["group_chat", "family_chores", "instacart", "sms"] as const;

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

/**
 * Apple App Store Custom Product Page IDs keyed by promo variant.
 * Pass as `af_ios_store_cpp` in the AppsFlyer OneLink URL so users land on the
 * variant-specific App Store page with the right screenshots.
 */
export const ORB_PROMO_CPP_IDS: Partial<Record<OrbPromoValue, string>> = {
  sms: "264256b4-4495-4c33-a964-9057d04c1028",
};

/**
 * Per-variant content used in BOTH the top banner and the /waitlist page.
 *
 * Word-count guidance (these strings render in two places — keep them tight):
 * - banner.title:      ≤ 10 words. Single line on mobile.
 * - banner.hint:       ≤ 16 words. Single supporting line under the title.
 * - waitlist.title:    ≤ 8  words. Hero headline on the waitlist screen.
 * - waitlist.subtitle: ≤ 12 words. One-sentence positioning.
 * - waitlist.description: 25–45 words. Two short sentences max.
 */
export interface OrbPromoContent {
  banner: { title: string; hint: string };
  waitlist: { title: string; subtitle: string; description: string };
}

export const ORB_PROMO_CONTENT: Record<OrbPromoValue, OrbPromoContent> = {
  group_chat: {
    banner: {
      title: "Let Orbits bring order to your family group chat.",
      hint: "Tap to invite Orbits to your group chat today.",
    },
    waitlist: {
      title: "Orbits in your group chat",
      subtitle: "We're slowly rolling out Orbits for group chats.",
      description:
        "Add Orbits to your family group chat and it'll automatically pick up reminders, events, and lists. We'll let you know once it's available in your region.",
    },
  },
  family_chores: {
    banner: {
      title:
        "Get more done with Orbits family tasks. Scheduled. Reminded. Done.",
      hint: "Your family clean routine, now actually done with Orbits.",
    },
    waitlist: {
      title: "Family chores, finally handled",
      subtitle: "We're rolling out Orbits family chores gradually.",
      description:
        "Schedule recurring chores, assign them across your household, and get nudges when something slips. We'll let you know when you're off the waitlist.",
    },
  },
  instacart: {
    banner: {
      title: "Let Orbits handle the groceries (and save $20!)",
      hint: "Tap to order your grocery list using Instacart and get $20 off your first order through Orbits!",
    },
    waitlist: {
      title: "Groceries, ordered for you",
      subtitle: "Instacart ordering through Orbits is rolling out gradually.",
      description:
        "Turn your shared grocery list into an Instacart order in one tap, and get $20 off your first order. We'll email you as soon as it's available.",
    },
  },
  sms: {
    banner: {
      title: "Text Orbits. Get it done.",
      hint: "Tap to download Orbits and start texting your household assistant.",
    },
    waitlist: {
      title: "Your assistant, right where you need it most",
      subtitle: "We're slowly rolling out Bit over text.",
      description:
        "Text Bit directly or add Bit to your group chat. Bit will automatically pick up any reminders, events, grocery list items, and more. We'll let you know once this launches in your region.",
    },
  },
};

export function getOrbPromoBannerLabel(promo: OrbPromoValue) {
  return ORB_PROMO_CONTENT[promo].banner;
}

export function getOrbPromoWaitlistCopy(promo: OrbPromoValue) {
  return ORB_PROMO_CONTENT[promo].waitlist;
}
