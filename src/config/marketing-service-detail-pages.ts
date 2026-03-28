/**
 * Maps URL path (no leading slash) to CMS `GET /v1/page/:id` for `marketing_service_detail`.
 * Use full API `slug` when nested, e.g. `marketing-support-service/market-intelligence`.
 * Single-segment keys (e.g. `market-intelligence`) are legacy aliases for `/marketing-services/...` redirects.
 *
 * **Auto-discovery:** set `MARKETING_SERVICE_DETAIL_PAGE_ID_RANGE` (e.g. `1-50`) so the app scans
 * those numeric ids and treats any `layout: marketing_service_detail` as a detail page — new CMS
 * pages work without editing this file. Empty value disables scanning (manual ids only).
 *
 * If the CMS **slug** changes, the site still resolves detail pages by matching the request path
 * to `GET /v1/page/:id` → `data.slug` for every resolved candidate id (defaults + env + range scan).
 *
 * Override path→id via `MARKETING_SERVICE_DETAIL_PAGE_IDS` JSON, e.g.
 * `{"marketing-support-service/market-intelligence":2,"recipe-support":3}`
 */
const DEFAULT_MARKETING_DETAIL_PAGE_IDS: Record<string, number> = {
  'marketing-support-service/market-intelligence': 2,
  'market-intelligence': 2,
};

/** Normalize a URL path or CMS slug for comparison (no leading/trailing slashes). */
export function normalizeMarketingPathKey(key: string): string {
  return key.replace(/^\/+|\/+$/g, '').trim();
}

/**
 * CMS page ids used to resolve a detail URL when the path is not in the static map
 * but the API `slug` matches (e.g. slug renamed in CMS). Values come from the
 * default map, optional `MARKETING_SERVICE_DETAIL_PAGE_IDS` JSON, and
 * `MARKETING_SERVICE_DETAIL_PAGE_CANDIDATE_IDS` (comma-separated, e.g. `2,3,5`).
 */
export function getMarketingServiceDetailCandidatePageIds(): number[] {
  const set = new Set<number>();
  for (const id of Object.values(DEFAULT_MARKETING_DETAIL_PAGE_IDS)) {
    if (typeof id === 'number' && id > 0) set.add(id);
  }
  const raw = process.env.MARKETING_SERVICE_DETAIL_PAGE_IDS?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      for (const v of Object.values(parsed)) {
        const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
        if (Number.isInteger(n) && n > 0) set.add(n);
      }
    } catch {
      // ignore invalid JSON
    }
  }
  const extra = process.env.MARKETING_SERVICE_DETAIL_PAGE_CANDIDATE_IDS?.trim();
  if (extra) {
    for (const part of extra.split(/[\s,]+/)) {
      const n = Number(part);
      if (Number.isInteger(n) && n > 0) set.add(n);
    }
  }
  return [...set].sort((a, b) => a - b);
}

export function getMarketingServiceDetailPageId(pathOrSlug: string): number | null {
  const normalized = normalizeMarketingPathKey(pathOrSlug);
  if (!normalized) return null;

  const raw = process.env.MARKETING_SERVICE_DETAIL_PAGE_IDS?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const id = parsed[normalized];
      const n = typeof id === 'string' ? Number(id) : typeof id === 'number' ? id : NaN;
      if (Number.isInteger(n) && n > 0) return n;
    } catch {
      // ignore invalid JSON
    }
  }
  const fallback = DEFAULT_MARKETING_DETAIL_PAGE_IDS[normalized];
  return typeof fallback === 'number' && fallback > 0 ? fallback : null;
}
