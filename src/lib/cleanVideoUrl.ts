/** Strip CMS junk query params (e.g. `themeRefresh`) so YouTube parsing stays reliable. */
export function cleanVideoUrlFromApi(url: string | undefined): string | null {
  const trimmed = url?.trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    u.searchParams.delete('themeRefresh');
    return u.toString();
  } catch {
    return trimmed.replace(/[&?]themeRefresh=\d+/i, '').replace(/\?$/, '') || null;
  }
}
