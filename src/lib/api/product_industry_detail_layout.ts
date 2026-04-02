type Media = { url?: string | null } | null | undefined;
import { normalizeText } from '@/lib/htmlText';

type ProductIndustryDetailApiResponse = {
  data?: {
    slug: string;
    title: string;
    content?: string;
    layout?: string;
    meta?: {
      breadcrumb_image?: Media;
      short_summary_icon?: Media;
      short_summary_title?: string;
      short_description?: string;

      support_title?: string;
      support_subtitle?: string;
      support_description?: string;
      support_items?: unknown;

      pilot_plant_title?: string;
      pilot_plant_subtitle?: string;
      pilot_plant_image?: Media;
      pilot_plant_navigation_url?: string;

      leading_title?: string;
      leading_subtitle?: string;
      leading_image?: Media;
      leading_items?: unknown;

      recommended_products?: Array<{
        id?: number | string;
        title?: string;
        slug?: string;
        short_summary_image?: Media;
        short_summary_description?: string;
      }>;
    };
    seo?: Record<string, unknown>;
  };
};

export type IndustrySupportItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

export type IndustryRecommendedProduct = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image?: string;
};

export type ProductIndustryDetailPageData = {
  title: string;
  heroBackgroundImage?: string;
  shortDescription?: string;
  support: {
    title: string;
    subtitle: string;
    description?: string;
    items: IndustrySupportItem[];
  };
  pilotPlantCta?: {
    label?: string;
    heading?: string;
    ctaText: string;
    ctaLink: string;
  };
  globalImpact?: {
    label: string;
    heading: string;
    image: string;
    imageAlt: string;
    features: string[];
  };
  recommendedProducts: IndustryRecommendedProduct[];
  seo: Record<string, unknown>;
};

function buildPageApiPath(slug: string) {
  return slug
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function stripHtml(value?: string | null) {
  if (!value) return '';
  return normalizeText(value.replace(/<[^>]+>/g, ' '));
}

function mediaUrl(media?: Media): string | undefined {
  const url = media?.url;
  if (typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  // Guard: IDs like "129" are not valid image URLs for next/image.
  if (/^\d+$/.test(trimmed)) return undefined;
  return trimmed;
}

function safeJsonParse<T>(input: unknown): T | null {
  if (!input) return null;
  if (typeof input === 'string') {
    try {
      return JSON.parse(input) as T;
    } catch {
      return null;
    }
  }
  if (typeof input === 'object') return input as T;
  return null;
}

async function resolveMediaIdToUrl(baseUrl: string, id: string): Promise<string | undefined> {
  const cleanId = id.trim();
  if (!cleanId) return undefined;
  if (/^https?:\/\//i.test(cleanId)) return cleanId;
  if (!/^\d+$/.test(cleanId)) return undefined;

  const candidates = [
    `${baseUrl}/v1/media/${cleanId}`,
    `${baseUrl}/v1/media/show/${cleanId}`,
    `${baseUrl}/v1/media/file/${cleanId}`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const payload = (await res.json()) as { data?: { url?: string | null } } | { url?: string | null };
      const found =
        'data' in payload
          ? (payload as any)?.data?.url
          : (payload as any)?.url;
      if (typeof found === 'string' && found.trim()) return found.trim();
    } catch {
      continue;
    }
  }

  return undefined;
}

export async function fetchProductIndustryDetailLayoutPage(slug: string) {
  const baseUrl = process.env.COMPANY_API_BASE_URL;
  if (!baseUrl) return null;
  const apiBaseUrl = baseUrl;

  const clean = slug.replace(/^\/+|\/+$/g, '');
  if (!clean) return null;

  try {
    const apiSlugPath = buildPageApiPath(clean);
    const res = await fetch(`${baseUrl}/v1/page/${apiSlugPath}`, { cache: 'no-store' });
    if (!res.ok) return null;

    const { data } = (await res.json()) as ProductIndustryDetailApiResponse;
    if (!data || data.layout !== 'product_industry_detail') return null;

    const meta = data.meta || {};

    const supportJson = safeJsonParse<{
      image?: Array<string | { url?: string | null }>;
      title?: string[];
      description?: string[];
    }>(meta.support_items);

    const supportImages = supportJson?.image || [];
    const supportTitles = supportJson?.title || [];
    const supportDescriptions = supportJson?.description || [];

    async function supportImageToUrl(input: unknown): Promise<string | undefined> {
      if (!input) return undefined;
      if (typeof input === 'string') {
        const raw = input.trim();
        if (!raw) return undefined;
        return mediaUrl({ url: raw }) || (await resolveMediaIdToUrl(apiBaseUrl, raw));
      }
      if (typeof input === 'object') {
        const url = mediaUrl(input as { url?: string | null });
        return url;
      }
      return undefined;
    }

    const supportItems: IndustrySupportItem[] = await Promise.all(
      supportTitles.map(async (t, idx) => {
        const title = (t || '').trim();
        const description = (supportDescriptions[idx] || '').trim();
        const image = await supportImageToUrl(supportImages[idx]);
        return {
          id: `support-${idx}`,
          title,
          description,
          image,
        };
      }),
    );

    const leadingJson = safeJsonParse<{ key_points?: string[] }>(meta.leading_items);
    const leadingPoints = (leadingJson?.key_points || []).filter(
      (p): p is string => typeof p === 'string' && !!p.trim(),
    );

    const recommended: IndustryRecommendedProduct[] = (meta.recommended_products || [])
      .map((p) => ({
        id: String(p.id || p.slug || p.title || ''),
        title: (p.title || '').trim(),
        slug: (p.slug || '').replace(/^\/+/, ''),
        description: stripHtml(p.short_summary_description || ''),
        image: mediaUrl(p.short_summary_image),
      }))
      .filter((p) => !!p.title && !!p.slug);

    const page: ProductIndustryDetailPageData = {
      title: meta.short_summary_title || data.title,
      heroBackgroundImage: mediaUrl(meta.breadcrumb_image),
      shortDescription: stripHtml(meta.short_description) || stripHtml(data.content) || undefined,
      support: {
        title: meta.support_title || data.title,
        subtitle: meta.support_subtitle || 'WHAT WE SUPPORT',
        description: (meta.support_description || '').trim() || undefined,
        items: supportItems.filter((i) => !!i.title),
      },
      pilotPlantCta: meta.pilot_plant_navigation_url
        ? {
            label: meta.pilot_plant_title || undefined,
            heading: meta.pilot_plant_subtitle || undefined,
            ctaText: 'CONTACT US',
            ctaLink: `/${meta.pilot_plant_navigation_url.replace(/^\/+/, '')}`,
          }
        : undefined,
      globalImpact:
        meta.leading_title && meta.leading_subtitle && mediaUrl(meta.leading_image)
          ? {
              label: meta.leading_title,
              heading: meta.leading_subtitle,
              image: mediaUrl(meta.leading_image)!,
              imageAlt: meta.leading_subtitle || meta.leading_title,
              features: leadingPoints,
            }
          : undefined,
      recommendedProducts: recommended,
      seo: data.seo || {},
    };

    return {
      slug: data.slug,
      title: data.title,
      seo: data.seo || {},
      page,
    };
  } catch {
    return null;
  }
}

