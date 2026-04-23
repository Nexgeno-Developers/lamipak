export type SitemapUrlEntry = {
  slug?: string;
  lastmod?: string;
  published_at?: string;
};

export type SitemapApiData = {
  generated_at?: string;
  company_id?: number | null;
  types?: string[];
  pages?: SitemapUrlEntry[];
  posts?: SitemapUrlEntry[];
  categories?: SitemapUrlEntry[];
};

export type SitemapApiResponse = {
  data?: SitemapApiData;
};

type SitemapUrl = {
  loc: string;
  lastmod?: string;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isIsoDate(value: string | undefined): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeLocFromSlug(slug: string, origin: string): string {
  const trimmed = slug.trim();
  if (!trimmed) return '';

  if (trimmed === '/') {
    return `${origin}/`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const asPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin}${asPath}`;
}

function pushUrls(target: SitemapUrl[], entries: SitemapUrlEntry[] | undefined, origin: string) {
  if (!Array.isArray(entries)) return;

  for (const entry of entries) {
    const slug = typeof entry?.slug === 'string' ? entry.slug : '';
    const loc = normalizeLocFromSlug(slug, origin);
    if (!loc) continue;

    const lastmod = isIsoDate(entry?.lastmod) ? entry.lastmod : undefined;
    target.push({ loc, lastmod });
  }
}

function dedupeAndSort(urls: SitemapUrl[], home: string): SitemapUrl[] {
  const seen = new Set<string>();
  const unique: SitemapUrl[] = [];

  for (const u of urls) {
    if (!u.loc) continue;
    if (seen.has(u.loc)) continue;
    seen.add(u.loc);
    unique.push(u);
  }

  unique.sort((a, b) => {
    const aHome = a.loc === home;
    const bHome = b.loc === home;
    if (aHome && !bHome) return -1;
    if (!aHome && bHome) return 1;
    return a.loc.localeCompare(b.loc);
  });

  return unique;
}

function buildSitemapXml(urls: SitemapUrl[]): string {
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  for (const url of urls) {
    lines.push('  <url>');
    lines.push(`    <loc>${escapeXml(url.loc)}</loc>`);
    if (url.lastmod) {
      lines.push(`    <lastmod>${escapeXml(url.lastmod)}</lastmod>`);
    }
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  lines.push('');
  return lines.join('\n');
}

export function buildSitemapXmlFromApiResponse(payload: SitemapApiResponse, origin: string): {
  xml: string;
  urlCount: number;
} {
  const data = payload?.data;

  const urls: SitemapUrl[] = [];
  pushUrls(urls, data?.pages, origin);
  pushUrls(urls, data?.posts, origin);
  pushUrls(urls, data?.categories, origin);

  const finalUrls = dedupeAndSort(urls, `${origin}/`);

  return {
    xml: buildSitemapXml(finalUrls),
    urlCount: finalUrls.length,
  };
}
