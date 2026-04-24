import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

import { getSitemapApiUrl } from '@/lib/api/sitemap';
import { resolvePublicDir } from '@/lib/sitemap/publicDir';
import { buildSitemapXmlFromApiResponse, type SitemapApiResponse } from '@/lib/sitemap/sitemapXml';

export const dynamic = 'force-dynamic';

function resolvePublicOrigin(reqUrl: URL): string {
  const explicit = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  return reqUrl.origin;
}

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);

  const token = reqUrl.searchParams.get('token') || '';
  const expected =
    (process.env.SITEMAP_GENERATE_TOKEN || '').trim() ||
    (process.env.CACHE_CLEAR_TOKEN || '').trim();

  if (expected && token !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const origin = resolvePublicOrigin(reqUrl);

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
    const { xml, urlCount } = buildSitemapXmlFromApiResponse(payload, origin);

    const publicDir = await resolvePublicDir();
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
      urlCount,
      origin,
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
