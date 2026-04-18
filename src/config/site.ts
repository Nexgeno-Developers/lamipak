/**
 * Public site URL for canonical links, Open Graph (`og:url`), Twitter cards, and WhatsApp previews.
 *
 * Set **NEXT_PUBLIC_SITE_URL** (e.g. `https://www.lamipak.com`) for production and local previews.
 * On Vercel, **VERCEL_URL** is used when that env var is unset.
 *
 * If neither is set, `getPublicSiteUrl()` returns an empty string (no default host).
 */

export function getPublicSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${host}`;
  }
  return '';
}

export const SITE_CONFIG = {
  get url() {
    return getPublicSiteUrl();
  },
  name: 'Lamipak',
  description: 'Building the future with innovative solutions',
} as const;

/**
 * Canonical URL for a path. If no public base URL is configured, returns the path only (e.g. `/about`).
 */
export function getCanonicalUrl(path: string = '/'): string {
  const baseUrl = getPublicSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!baseUrl) {
    return cleanPath;
  }
  return `${baseUrl}${cleanPath}`;
}
