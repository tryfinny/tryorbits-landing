import * as amplitude from "@amplitude/analytics-browser";

import { getOrbPromoFromSearch, ORB_PROMO_CPP_IDS, type OrbPromoValue } from "@/lib/orb-promo";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

const AMPLITUDE_API_KEY = "d9d4c952d27ebbfbd7756d0f2748952";

// AppsFlyer OneLink configuration
const ONELINK_BASE_URL = "https://orbits.onelink.me/dhsI/vhlrrfou";

let isInitialized = false;

export function initAnalytics() {
  if (isInitialized) return;

  amplitude.init(AMPLITUDE_API_KEY, {
    transport: "beacon",
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: false,
      fileDownloads: false,
    },
  });

  // Set platform as a user property so ALL events (including auto-tracked) are tagged
  const identifyEvent = new amplitude.Identify();
  identifyEvent.set("platform", "web_landing_page");
  amplitude.identify(identifyEvent);

  isInitialized = true;
}

// Core tracking function
export function track(eventName: string, properties?: Record<string, unknown>) {
  amplitude.track(eventName, properties);
}

// GA4 event for Google Ads conversion tracking
function trackGA4GetOrbitsClick(location: string, store?: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "get_orbits_click", {
      button_location: location,
      store: store ?? "combined",
    });
  }
}

// Page view tracking (called on route changes)
export function trackPageView(pageName: string, path: string) {
  track("page_viewed", {
    page_name: pageName,
    page_path: path,
    platform: "web_landing_page",
  });
}

// CTA button click (the main "Get Orbits" button)
export function trackCtaClick(location: string) {
  track("cta_clicked", {
    location,
    cta_type: "get_orbits",
    platform: "web_landing_page",
  });
  trackGA4GetOrbitsClick(location);
}

// App store button click (when user clicks iOS or Android download)
export function trackAppStoreClick(
  store: "app_store" | "play_store",
  location: string,
) {
  track("app_store_button_clicked", {
    store,
    location,
    platform: "web_landing_page",
  });
  trackGA4GetOrbitsClick(location, store);
}

// QR code click on install page
export function trackQrCodeClick(source: string = "qr_code") {
  track("qr_code_clicked", {
    source,
    platform: "web_landing_page",
  });
}

/** Fired when the `orb_promo` top banner is shown (valid param present). */
export function trackPromoBannerShown(properties: {
  promo_variant: OrbPromoValue;
  page_path: string;
}) {
  track("promo_banner_shown", {
    ...properties,
    platform: "web_landing_page",
  });
}

/** Fired when the user taps the `orb_promo` banner (navigates to install). */
export function trackPromoBannerClicked(properties: {
  promo_variant: OrbPromoValue;
  page_path: string;
}) {
  track("promo_banner_clicked", {
    ...properties,
    platform: "web_landing_page",
  });
}

// Install page visit with device info
export function trackInstallPageVisit(
  deviceType: string,
  willRedirect: boolean,
  redirectDestination: string | null,
  utmParams?: Record<string, string>,
) {
  track("install_page_visited", {
    device_type: deviceType,
    will_redirect: willRedirect,
    redirect_destination: redirectDestination,
    platform: "web_landing_page",
    ...utmParams,
  });
}

// Waitlist interest (user wants early access to an upcoming feature)
export function trackWaitlistInterest(properties: {
  feature: string;
  source?: string;
  campaign?: string;
  email?: string;
}) {
  track("waitlist_interest", {
    ...properties,
    platform: "web_landing_page",
  });
}

// ============================================
// AppsFlyer OneLink Attribution
// ============================================

// Get UTM parameters from the current URL
export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  // Standard UTM params
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];

  utmKeys.forEach((key) => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

// Build the AppsFlyer OneLink URL with attribution params
export function getOneLinkUrl(
  additionalParams?: Record<string, string>,
): string {
  const utmParams = getUtmParams();
  const params = new URLSearchParams();

  // Map UTM params to AppsFlyer params
  // c = campaign, af_channel = source, af_adset = content, af_ad = term
  if (utmParams.utm_campaign) {
    params.set("c", utmParams.utm_campaign);
  }
  if (utmParams.utm_source) {
    params.set("af_channel", utmParams.utm_source);
  }
  if (utmParams.utm_medium) {
    params.set("af_adset", utmParams.utm_medium);
  }
  if (utmParams.utm_content) {
    params.set("af_ad", utmParams.utm_content);
  }
  if (utmParams.utm_term) {
    params.set("af_keywords", utmParams.utm_term);
  }

  // Also pass raw UTM params in sub params for reference
  if (utmParams.utm_source) {
    params.set("af_sub1", utmParams.utm_source);
  }
  if (utmParams.utm_medium) {
    params.set("af_sub2", utmParams.utm_medium);
  }
  if (utmParams.utm_campaign) {
    params.set("af_sub3", utmParams.utm_campaign);
  }

  // Pass Google Click ID for web-to-app conversion matching
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const gclid = urlParams.get("gclid");
    if (gclid) {
      params.set("af_sub5", gclid);
    }
    const orbPromo = getOrbPromoFromSearch(window.location.search);
    if (orbPromo) {
      params.set("deep_link_value", orbPromo);
      const cppId = ORB_PROMO_CPP_IDS[orbPromo];
      if (cppId) {
        params.set("af_cp", cppId);
      }
    }
  }

  // Add any additional params (e.g., button location)
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.set(key, value);
    });
  }

  const queryString = params.toString();
  return queryString ? `${ONELINK_BASE_URL}?${queryString}` : ONELINK_BASE_URL;
}

// ============================================
// Attribution Cookie
// ============================================

const ATTRIBUTION_COOKIE_NAME = "orbits_attribution";
const ATTRIBUTION_COOKIE_DAYS = 30;

export function setAttributionCookie(utmParams: Record<string, string>): void {
  if (typeof document === "undefined" || Object.keys(utmParams).length === 0) return;
  const expires = new Date();
  expires.setDate(expires.getDate() + ATTRIBUTION_COOKIE_DAYS);
  document.cookie = `${ATTRIBUTION_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(utmParams))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
}

export function getAttributionCookie(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const match = document.cookie.match(new RegExp("(?:^|; )" + ATTRIBUTION_COOKIE_NAME + "=([^;]*)"));
  if (!match) return {};
  try { return JSON.parse(decodeURIComponent(match[1])); } catch { return {}; }
}

// ============================================
// Meta Pixel Events
// ============================================

export function trackMetaLead(utmParams: Record<string, string>): void {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      content_name: "install_page",
      ...utmParams,
    });
  }
}

// ============================================
// TikTok Pixel Events
// ============================================

export function trackTikTokClickButton(utmParams: Record<string, string>): void {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track("ClickButton", {
      content_name: "install_page",
      ...utmParams,
    });
  }
}
