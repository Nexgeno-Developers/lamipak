import { promises as fs } from 'fs';
import path from 'path';

function rtrimSlash(value) {
  return value.replace(/\/+$/, '');
}

function getEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

function ensureTrailingNewline(text) {
  const normalized = text.replace(/\r\n?/g, '\n');
  return normalized.trimEnd() + '\n';
}

function ensureSitemapLine(text, siteBase) {
  const hasSitemap = /^\s*sitemap\s*:/gim.test(text);
  if (hasSitemap) return text;
  return text + `Sitemap: ${siteBase}/sitemap.xml\n`;
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

  const apiUrl = `${apiBase}/v1/robots-txt?format=txt`;

  const res = await fetch(apiUrl, {
    method: 'GET',
    headers: { Accept: 'text/plain' },
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(`Robots API failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const raw = await res.text();
  let content = ensureTrailingNewline(raw);
  content = ensureSitemapLine(content, siteBase);

  const publicDir = path.join(process.cwd(), 'public');
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

  console.log('Generated -> public/robots.txt');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
