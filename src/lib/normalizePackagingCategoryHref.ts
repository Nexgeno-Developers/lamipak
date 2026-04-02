export function normalizePackagingCategoryHref(href?: string | null): string {
  const PACKAGING_BASE = '/aseptic-pakaging-solutions';

  const raw = (href ?? '').trim();
  if (!raw) return PACKAGING_BASE;

  // If it's a full URL, keep only the pathname.
  let pathname = raw;
  try {
    pathname = new URL(raw).pathname;
  } catch {
    // not a full URL
  }

  // Make absolute path if it's relative.
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
  pathname = pathname.replace(/\/+$/, '');

  // Collapse duplicated base segment.
  // `/aseptic-pakaging-solutions/aseptic-pakaging-solutions/<slug>`
  // -> `/aseptic-pakaging-solutions/<slug>`
  pathname = pathname.replace(/^\/aseptic-pakaging-solutions\/aseptic-pakaging-solutions\//, `${PACKAGING_BASE}/`);

  // If the path already contains a "packaging base" again inside the next segment
  // (example: `/aseptic-pakaging-solutions/12121aseptic-pakaging-solutions/roll-fed`),
  // remove the leading base so we keep only what the API intended.
  pathname = pathname.replace(
    /^\/aseptic-pakaging-solutions\/([^\/]*aseptic-pakaging-solutions[^\/]*)\//,
    '/$1/'
  );

  return pathname;
}

