const NAMED_ENTITIES: Record<string, string> = {
  nbsp: ' ',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

function decodeHtmlEntity(entity: string): string {
  const named = NAMED_ENTITIES[entity];
  if (named !== undefined) return named;

  if (entity.startsWith('#x') || entity.startsWith('#X')) {
    const hex = entity.slice(2);
    const code = Number.parseInt(hex, 16);
    return Number.isFinite(code) ? String.fromCodePoint(code) : `&${entity};`;
  }

  if (entity.startsWith('#')) {
    const dec = entity.slice(1);
    const code = Number.parseInt(dec, 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : `&${entity};`;
  }

  return `&${entity};`;
}

export function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  // Decode minimal set of entities and numeric entities.
  const decoded = input.replace(/&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/g, (_m, ent) =>
    decodeHtmlEntity(ent),
  );
  // Normalize non-breaking spaces to regular spaces.
  return decoded.replace(/\u00A0/g, ' ');
}

export function normalizeText(input: string): string {
  return decodeHtmlEntities(input).replace(/\s+/g, ' ').trim();
}

