function parseYouTubeStartSeconds(searchParams: URLSearchParams): number | null {
  const t = searchParams.get('t') ?? searchParams.get('start');
  if (t == null || t === '') return null;
  const trimmed = t.trim();
  const hms = trimmed.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/i);
  if (hms && (hms[1] || hms[2] || hms[3])) {
    return (
      (hms[1] ? parseInt(hms[1], 10) * 3600 : 0) +
      (hms[2] ? parseInt(hms[2], 10) * 60 : 0) +
      (hms[3] ? parseInt(hms[3], 10) : 0)
    );
  }
  const plain = /^(\d+)$/.exec(trimmed);
  if (plain) return parseInt(plain[1], 10);
  return null;
}

function appendStartToEmbed(embedBase: string, searchParams: URLSearchParams): string {
  const start = parseYouTubeStartSeconds(searchParams);
  if (start == null || start <= 0) return embedBase;
  const join = embedBase.includes('?') ? '&' : '?';
  return `${embedBase}${join}start=${start}`;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      if (!id) return null;
      const base = `https://www.youtube.com/embed/${id}`;
      return appendStartToEmbed(base, u.searchParams);
    }
    if (host.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) {
        const base = `https://www.youtube.com/embed/${v}`;
        return appendStartToEmbed(base, u.searchParams);
      }
      const shorts = u.pathname.match(/^\/shorts\/([^/]+)/);
      if (shorts?.[1]) {
        const base = `https://www.youtube.com/embed/${shorts[1]}`;
        return appendStartToEmbed(base, u.searchParams);
      }
      const embed = u.pathname.match(/^\/embed\/([^/]+)/);
      if (embed?.[1]) {
        const base = `https://www.youtube.com/embed/${embed[1]}`;
        return appendStartToEmbed(base, u.searchParams);
      }
    }
  } catch {
    return null;
  }
  return null;
}

/** Video id for thumbnails (`img.youtube.com/vi/{id}/...`). */
export function getYouTubeVideoId(url: string): string | null {
  const embed = getYouTubeEmbedUrl(url);
  if (!embed) return null;
  const m = /\/embed\/([^/?]+)/.exec(embed);
  return m?.[1] ?? null;
}
