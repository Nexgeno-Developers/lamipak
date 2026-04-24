import type { Metadata } from 'next';

import { getCanonicalUrl } from '@/config/site';

type ApiSeo = {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  canonical_url?: string | null;
  robots_index?: string | null;
  robots_follow?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: { url?: string | null } | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: { url?: string | null } | null;
};

type ApiPage = {
  slug: string;
  title: string;
  seo?: ApiSeo | null;
};

/** CMS may store `<script type="application/ld+json">…</script>` instead of raw JSON. */
function unwrapLdJsonScriptSnippet(raw: string): string {
  const t = raw.trim();
  const re =
    /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i;
  const m = t.match(re);
  if (m?.[1]) return m[1].trim();
  return t;
}

function stripTrailingScriptClose(jsonish: string): string {
  return jsonish.replace(/<\/script>\s*$/i, '').trim();
}

/** Keep only `{` … `}` so trailing `</script>` or noise after the object does not break `JSON.parse`. */
function trimToBalancedObject(jsonish: string): string {
  const last = jsonish.lastIndexOf('}');
  if (last === -1) return jsonish;
  return jsonish.slice(0, last + 1).trim();
}

/**
 * CMS paste errors: `"name": "foo,` newline `"url":` without closing `"` before the comma-newline.
 */
function repairUnclosedStringBeforeNextKey(jsonish: string): string {
  return jsonish.replace(
    /"([\w-]+)"(\s*:\s*")([^"]*),(\r?\n\s*")([\w-]+"\s*:)/g,
    '"$1"$2$3",$4$5',
  );
}

function tryParseLdObject(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }
  return null;
}

/** Normalize API `seo.schema`: object, JSON string, or script-wrapped JSON. */
export function parseLdJsonSchema(schema: unknown): Record<string, unknown> | null {
  if (schema == null) return null;
  if (typeof schema === 'object' && !Array.isArray(schema)) {
    return schema as Record<string, unknown>;
  }
  if (typeof schema === 'string') {
    let t = schema.trim();
    if (!t) return null;
    t = unwrapLdJsonScriptSnippet(t);
    t = stripTrailingScriptClose(t);
    t = trimToBalancedObject(t);

    const direct = tryParseLdObject(t);
    if (direct) return direct;

    const repaired = repairUnclosedStringBeforeNextKey(t);
    if (repaired !== t) {
      const again = tryParseLdObject(repaired);
      if (again) return again;
    }
  }
  return null;
}

/** Default index,follow; only block when CMS explicitly sends noindex / nofollow. */
function robotsAllows(value: string | null | undefined, blockLower: 'noindex' | 'nofollow'): boolean {
  if (value == null) return true;
  const t = String(value).trim().toLowerCase();
  if (!t) return true;
  return t !== blockLower;
}

export function buildApiMetadata(page: ApiPage): Metadata {
  const seo = (page.seo || {}) as ApiSeo;

  const canonical = seo.canonical_url && /^https?:\/\//i.test(seo.canonical_url)
    ? seo.canonical_url
    : getCanonicalUrl(seo.canonical_url || `/${page.slug}/`);

  return {
    title: seo.title || page.title,
    description: seo.description || undefined,
    keywords: seo.keywords || undefined,
    robots: {
      index: robotsAllows(seo.robots_index, 'noindex'),
      follow: robotsAllows(seo.robots_follow, 'nofollow'),
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title: seo.og_title || seo.title || page.title,
      description: seo.og_description || seo.description || undefined,
      url: canonical,
      type: 'website',
      images: seo.og_image?.url ? [seo.og_image.url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitter_title || seo.title || page.title,
      description: seo.twitter_description || seo.description || undefined,
      images: seo.twitter_image?.url ? [seo.twitter_image.url] : undefined,
    },
  };
}

