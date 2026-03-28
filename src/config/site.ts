/**
 * Site Configuration
 * 
 * Central configuration for site-wide settings.
 * Uses NEXT_PUBLIC_SITE_URL environment variable for the base URL.
 * Falls back to localhost for development.
 */

export const SITE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  name: 'Lamipak',
  description: 'Building the future with innovative solutions',
} as const;

/**
 * Generates a canonical URL for a given path
 * 
 * @param path - The path (e.g., '/about', '/contact')
 * @returns The full canonical URL
 */
export function getCanonicalUrl(path: string = '/'): string {
  const baseUrl = SITE_CONFIG.url.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * CMS may send a path or absolute URL for `canonical_url`.
 */
export function resolveSeoCanonicalUrl(
  canonicalUrl: string | null | undefined,
  fallbackPath: string,
): string {
  const fallback = getCanonicalUrl(fallbackPath);
  const c = canonicalUrl?.trim();
  if (!c) return fallback;
  if (/^https?:\/\//i.test(c)) return c;
  return getCanonicalUrl(c);
}
