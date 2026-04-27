import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

import { resolvePublicDir } from '@/lib/sitemap/publicDir';
import { getRobotsTxtApiUrl } from '@/lib/api/robotsTxt';

export const dynamic = 'force-dynamic';

function resolvePublicOrigin(reqUrl: URL): string {
  const explicit = (process.env.NEXT_PUBLIC_SITE_URL || '').trim();
  if (explicit) return explicit.replace(/\/+$/, '');
  return reqUrl.origin;
}

function normalizeRobotsTxt(raw: string, origin: string): string {
  const normalized = raw.replace(/\r\n?/g, '\n').trimEnd() + '\n';

  // Ensure sitemap hint exists (SEO-friendly).
  const hasSitemap = /^\s*sitemap\s*:/gim.test(normalized);
  if (hasSitemap) return normalized;

  return normalized + `Sitemap: ${origin}/sitemap.xml\n`;
}

export async function GET(req: Request) {
  const reqUrl = new URL(req.url);

  const token = reqUrl.searchParams.get('token') || '';
  const expected =
    (process.env.ROBOTS_GENERATE_TOKEN || '').trim() ||
    (process.env.CACHE_CLEAR_TOKEN || '').trim();

  if (expected && token !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  const origin = resolvePublicOrigin(reqUrl);

  const robotsApiUrl = getRobotsTxtApiUrl();
  if (!robotsApiUrl) {
    return NextResponse.json(
      { ok: false, message: 'COMPANY_API_BASE_URL is not configured.' },
      { status: 500 },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(robotsApiUrl, {
      method: 'GET',
      headers: { Accept: 'text/plain' },
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: `Robots API failed with ${response.status}.` },
        { status: 502 },
      );
    }

    const raw = await response.text();
    if (raw.length > 1024 * 1024) {
      return NextResponse.json(
        { ok: false, message: 'Robots.txt content is too large.' },
        { status: 502 },
      );
    }

    const content = normalizeRobotsTxt(raw, origin);

    const publicDir = await resolvePublicDir();
    await fs.mkdir(publicDir, { recursive: true });

    const target = path.join(publicDir, 'robots.txt');
    const tmp = path.join(publicDir, `robots.txt.tmp-${process.pid}-${Date.now()}`);

    await fs.writeFile(tmp, content, 'utf8');

    try {
      await fs.rm(target, { force: true });
    } catch {
      // ignore
    }

    await fs.rename(tmp, target);

    return NextResponse.json({
      ok: true,
      written: '/robots.txt',
      bytes: Buffer.byteLength(content, 'utf8'),
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
          ? 'Robots generation timed out. Please try again.'
          : 'Unable to reach the robots API.',
      },
      { status: isAbort ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
