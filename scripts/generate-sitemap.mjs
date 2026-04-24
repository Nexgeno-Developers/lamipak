import { promises as fs } from 'fs';
import path from 'path';

function rtrimSlash(value) {
  return value.replace(/\/+$/, '');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

function canonicalUrl(siteBase, slug) {
  const trimmed = (slug || '').trim();
  if (!trimmed) return '';

  if (trimmed === '/') {
    return `${siteBase}/`;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const asPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${siteBase}${asPath}`;
}

function buildSitemapXml(urls) {
  const lines = [];
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

function dedupeAndSort(urls, homeLoc) {
  const seen = new Set();
  const unique = [];

  for (const u of urls) {
    if (!u || !u.loc) continue;
    if (seen.has(u.loc)) continue;
    seen.add(u.loc);
    unique.push(u);
  }

  unique.sort((a, b) => {
    const aHome = a.loc === homeLoc;
    const bHome = b.loc === homeLoc;
    if (aHome && !bHome) return -1;
    if (!aHome && bHome) return 1;
    return a.loc.localeCompare(b.loc);
  });

  return unique;
}

async function main() {
  const siteBaseRaw = getEnv('NEXT_PUBLIC_SITE_URL');
  const siteBase = siteBaseRaw ? rtrimSlash(siteBaseRaw) : '';

  const apiBaseRaw = getEnv('COMPANY_API_BASE_URL');
  const apiBase = apiBaseRaw ? rtrimSlash(apiBaseRaw) : '';

  if (!siteBase) {
    console.error('Missing NEXT_PUBLIC_SITE_URL. Example: https://www.lamipak.biz');
    process.exit(1);
  }

  if (!apiBase) {
    console.error('Missing COMPANY_API_BASE_URL. Example: https://backend.example.com/api');
    process.exit(1);
  }

  const apiUrl = `${apiBase}/v1/sitemap`;

  const res = await fetch(apiUrl, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Sitemap API failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const payload = await res.json();
  const data = payload && typeof payload === 'object' ? payload.data : null;

  const buckets = [];
  if (data && typeof data === 'object') {
    if (Array.isArray(data.pages)) buckets.push(...data.pages);
    if (Array.isArray(data.posts)) buckets.push(...data.posts);
    if (Array.isArray(data.categories)) buckets.push(...data.categories);

    // Back-compat: if old payloads put everything inside `pages`.
    if (buckets.length === 0 && Array.isArray(data.pages)) buckets.push(...data.pages);
  }

  if (buckets.length === 0) {
    console.error('No URLs received from sitemap API.');
    process.exit(1);
  }

  const urls = [];
  for (const entry of buckets) {
    const slug = entry && typeof entry === 'object' && typeof entry.slug === 'string' ? entry.slug : '';
    const loc = canonicalUrl(siteBase, slug);
    if (!loc) continue;

    const lastmod = entry && typeof entry === 'object' && isIsoDate(entry.lastmod) ? entry.lastmod : undefined;
    urls.push({ loc, lastmod });
  }

  const homeLoc = canonicalUrl(siteBase, '/');
  const finalUrls = dedupeAndSort(urls, homeLoc);
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

  console.log(`Generated ${finalUrls.length} URLs -> public/sitemap.xml`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
