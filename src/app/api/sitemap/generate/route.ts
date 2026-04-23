import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

import { getCanonicalUrl, getPublicSiteUrl } from '@/config/site';
import { getSitemapApiUrl, type SitemapApiResponse, type SitemapUrlEntry } from '@/lib/api/sitemap';

export const dynamic = 'force-dynamic';

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

function normalizeLocFromSlug(slug: string): string {
  const trimmed = slug.trim();
  if (!trimmed) return '';

  if (trimmed === '/') {
    return getCanonicalUrl('/');
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const asPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return getCanonicalUrl(asPath);
}

function pushUrls(target: SitemapUrl[], entries: SitemapUrlEntry[] | undefined) {
  if (!Array.isArray(entries)) return;

  for (const entry of entries) {
    const slug = typeof entry?.slug === 'string' ? entry.slug : '';
    const loc = normalizeLocFromSlug(slug);
    if (!loc) continue;

    const lastmod = isIsoDate(entry?.lastmod) ? entry.lastmod : undefined;
    target.push({ loc, lastmod });
  }
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

function dedupeAndSort(urls: SitemapUrl[]): SitemapUrl[] {
  const seen = new Set<string>();
  const unique: SitemapUrl[] = [];

  for (const u of urls) {
    if (!u.loc) continue;
    const key = u.loc;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(u);
  }

  const home = getCanonicalUrl('/');

  unique.sort((a, b) => {
    const aHome = a.loc === home;
    const bHome = b.loc === home;
    if (aHome && !bHome) return -1;
    if (!aHome && bHome) return 1;
    return a.loc.localeCompare(b.loc);
  });

  return unique;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token') || '';
  const expected =
    (process.env.SITEMAP_GENERATE_TOKEN || '').trim() ||
    (process.env.CACHE_CLEAR_TOKEN || '').trim();

  if (expected && token !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const siteUrl = getPublicSiteUrl();
  if (!siteUrl) {
    return NextResponse.json(
      { ok: false, message: 'NEXT_PUBLIC_SITE_URL is not configured.' },
      { status: 500 },
    );
  }

  const sitemapApiUrl = getSitemapApiUrl();
  if (!sitemapApiUrl) {
    return NextResponse.json(
      { ok: false, message: 'COMPANY_API_BASE_URL is not configured.' },
      { status: 500 },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(sitemapApiUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: `Sitemap API failed with ${response.status}.` },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as SitemapApiResponse;
    const data = payload?.data;

    const urls: SitemapUrl[] = [];

    // Support both the new schema (pages/posts/categories) and legacy payloads where
    // everything might be returned inside `pages`.
    pushUrls(urls, data?.pages);
    pushUrls(urls, data?.posts);
    pushUrls(urls, data?.categories);

    if (urls.length === 0) {
      return NextResponse.json(
        { ok: false, message: 'No URLs received from sitemap API.' },
        { status: 502 },
      );
    }

    const finalUrls = dedupeAndSort(urls);
    const xml = buildSitemapXml(finalUrls);

    const publicDir = path.join(process.cwd(), 'public');
    await fs.mkdir(publicDir, { recursive: true });

    const target = path.join(publicDir, 'sitemap.xml');
    const tmp = path.join(publicDir, `sitemap.xml.tmp-${process.pid}-${Date.now()}`);

    await fs.writeFile(tmp, xml, 'utf8');

    try {
      await fs.rm(target, { force: true });
    } catch {
      // ignore
    }

    await fs.rename(tmp, target);

    return NextResponse.json({
      ok: true,
      written: '/sitemap.xml',
      urlCount: finalUrls.length,
      at: new Date().toISOString(),
    });
  } catch (error) {
    const isAbort =
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name?: unknown }).name === 'AbortError';

    return NextResponse.json(
      {
        ok: false,
        message: isAbort
          ? 'Sitemap generation timed out. Please try again.'
          : 'Unable to reach the sitemap API.',
      },
      { status: isAbort ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
