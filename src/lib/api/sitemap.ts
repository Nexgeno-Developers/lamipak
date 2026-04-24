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

function buildCompanyApiUrl(endpoint: string): string | null {
  const baseUrl = process.env.COMPANY_API_BASE_URL?.trim();
  if (!baseUrl) return null;
  const base = baseUrl.replace(/\/+$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

export function getSitemapApiUrl(): string | null {
  return buildCompanyApiUrl('/v1/sitemap');
}
