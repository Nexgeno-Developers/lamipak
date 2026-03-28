/**
 * Maps `/marketing-services/[slug]` to CMS `GET /v1/page/:id` when `layout` is `marketing_service_detail`.
 * Override or extend via env `MARKETING_SERVICE_DETAIL_PAGE_IDS` (JSON object, e.g. `{"market-intelligence":2}`).
 */
const DEFAULT_MARKETING_DETAIL_PAGE_IDS: Record<string, number> = {
  'market-intelligence': 2,
};

export function getMarketingServiceDetailPageId(slug: string): number | null {
  const raw = process.env.MARKETING_SERVICE_DETAIL_PAGE_IDS?.trim();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const id = parsed[slug];
      const n = typeof id === 'string' ? Number(id) : typeof id === 'number' ? id : NaN;
      if (Number.isInteger(n) && n > 0) return n;
    } catch {
      // ignore invalid JSON
    }
  }
  const fallback = DEFAULT_MARKETING_DETAIL_PAGE_IDS[slug];
  return typeof fallback === 'number' && fallback > 0 ? fallback : null;
}
