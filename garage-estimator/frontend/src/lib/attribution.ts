// Reads the UTM + click-ID attribution the choice-uft (CUFT) WordPress
// plugin already captures for this visitor. The estimator runs in a
// same-origin iframe (northlandbuildingsupplies.ca/gbd/...), so both the
// cuft_utm_data cookie and the parent page's URL are directly readable.
//
// Key names mirror CUFT's own lists (class-cuft-utm-tracker.php,
// cuft-utm-tracker.js) exactly, so the backend can resolve platform without
// any re-mapping on this side.

export type Attribution = Record<string, string>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

const CLICK_ID_KEYS = [
  "click_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "rdt_cid",
  "msclkid",
  "ttclid",
  "li_fat_id",
  "twclid",
  "snap_click_id",
  "pclid",
];

const TRACKED_KEYS = [...UTM_KEYS, ...CLICK_ID_KEYS];

function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function parseCuftUtmCookie(): Attribution {
  const raw = readCookie("cuft_utm_data");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.utm === "object" ? parsed.utm : {};
  } catch {
    return {};
  }
}

function parseTrackedParams(search: string): Attribution {
  const params = new URLSearchParams(search);
  const out: Attribution = {};
  for (const key of TRACKED_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value;
  }
  return out;
}

// Merge order matches CUFT's own client-side priority (cuft-utm-tracker.js
// getCurrentTrackingData): cookie first, then the current URL's query string
// overrides it for any key present, since a fresh URL param is the newest
// signal available.
export function captureAttribution(): Attribution {
  const merged: Attribution = { ...parseCuftUtmCookie() };

  try {
    const parentSearch =
      window.parent && window.parent !== window
        ? window.parent.location.search
        : window.location.search;
    Object.assign(merged, parseTrackedParams(parentSearch));
  } catch {
    // Cross-origin parent would throw; the estimator is always embedded
    // same-origin in production, so this is just a defensive fallback.
  }

  return merged;
}
