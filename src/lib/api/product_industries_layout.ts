import { cache } from 'react';
import { formatBoldText } from '@/lib/htmlText';

type Media = { url?: string | null } | null | undefined;

type ProductIndustriesApiResponse = {
  data?: {
    slug: string;
    title: string;
    content?: string;
    layout?: string;
    meta?: {
      breadcrumb_image?: Media;
      breadcrumb_subtitle?: string;
      insights_title?: string;
      insights_subtitle?: string;
      insights_image?: Media;
      insights_navigation_url?: string;
      insights_description?: string;
    };
    seo?: Record<string, unknown>;
    autofetch?: {
      industries?: IndustryAutofetchItem[];
      featured_products?: FeaturedProductAutofetchItem[];
    };
  };
};

type IndustryAutofetchItem = {
  id?: number;
  title?: string;
  slug?: string;
  short_summary_icon?: Media;
  short_summary_title?: string;
  short_summary_description?: string;
};

type FeaturedProductAutofetchItem = {
  id?: number;
  title?: string;
  slug?: string;
  short_summary_image?: Media;
  short_summary_description?: string;
};

export type ProductIndustriesIndustry = {
  id: string;
  title: string;
  href: string;
  iconUrl?: string;
  description?: string;
};

export type ProductIndustriesFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  image?: string;
  imageAlt: string;
  description?: string;
  subtitle?: string;
};

export type ProductIndustriesInsights = {
  /** Small caps line above the headline (e.g. insights_subtitle). */
  eyebrow: string;
  /** Main headline (insights_title). */
  title?: string;
  descriptionHtml?: string;
  image?: string;
  ctaText: string;
  ctaHref?: string;
};

export type ProductIndustriesPageData = {
  title: string;
  heroBackgroundImage?: string;
  heroSubtitle?: string;
  insights: ProductIndustriesInsights | null;
  industries: ProductIndustriesIndustry[];
  featuredProducts: ProductIndustriesFeaturedProduct[];
};

function buildPageApiPath(slug: string) {
  return slug
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function slugCandidates(slug: string) {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  const last = clean.split('/').filter(Boolean).pop();
  return Array.from(new Set([clean, last].filter(Boolean) as string[]));
}

function mediaUrl(media?: Media) {
  const url = media?.url;
  return typeof url === 'string' && url.trim() ? url : undefined;
}

function cleanMeta(value?: string | null): string | undefined {
  const t = (value ?? '').trim();
  if (!t || t === '-') return undefined;
  return t;
}

function slugToHref(slug: string) {
  const s = slug.replace(/^\/+|\/+$/g, '');
  return s ? `/${s}/` : '/';
}

function displayIndustryTitle(item: IndustryAutofetchItem): string {
  const st = cleanMeta(item.short_summary_title);
  if (st) return st;
  return cleanMeta(item.title) || 'Industry';
}

function subtitleFromDescription(raw: string): string {
  const t = raw.replace(/\s+/g, ' ').trim();
  if (!t) return '';
  const first = t.split(/(?<=[.!?])\s+/)[0]?.trim() || t;
  return first.length > 120 ? `${first.slice(0, 117)}…` : first;
}

export const fetchProductIndustriesLayoutPage = cache(async (slug: string) => {
  const baseUrl = process.env.COMPANY_API_BASE_URL;
  if (!baseUrl) return null;

  for (const candidate of slugCandidates(slug)) {
    try {
      const apiSlugPath = buildPageApiPath(candidate);
      const autofetch = encodeURIComponent('industries,featured_products');
      const res = await fetch(`${baseUrl}/v1/page/${apiSlugPath}?autofetch=${autofetch}`, {
        cache: 'no-store',
      });
      if (!res.ok) continue;

      const { data } = (await res.json()) as ProductIndustriesApiResponse;
      if (!data || data.layout !== 'product_industries') continue;

      const meta = data.meta || {};
      const heroBg = mediaUrl(meta.breadcrumb_image);
      const heroSubtitle = cleanMeta(meta.breadcrumb_subtitle);

      const insightsImage = mediaUrl(meta.insights_image);
      const insightsTitle = cleanMeta(meta.insights_title);
      const insightsEyebrow = cleanMeta(meta.insights_subtitle) || 'Latest insights';
      const navRaw = (meta.insights_navigation_url || '').trim();
      const insightsHref =
        navRaw && navRaw !== '-' && navRaw !== '#'
          ? navRaw.startsWith('http')
            ? navRaw
            : slugToHref(navRaw.replace(/^\/+/, ''))
          : undefined;

      const descRaw = meta.insights_description?.trim();
      const hasBody =
        descRaw &&
        descRaw !== '-' &&
        !/^<p>\s*-\s*<\/p>\s*$/i.test(descRaw);

      const hasInsights = Boolean(
        insightsImage || insightsTitle || hasBody || insightsHref,
      );

      const insights: ProductIndustriesInsights | null = hasInsights
        ? {
            eyebrow: formatBoldText(insightsEyebrow),
            title: formatBoldText(insightsTitle || ''),
            descriptionHtml: hasBody ? meta.insights_description : undefined,
            image: insightsImage,
            ctaText: formatBoldText('Read full whitepaper'),
            ctaHref: insightsHref,
          }
        : null;

      const industries: ProductIndustriesIndustry[] = (data.autofetch?.industries || [])
        .map((item, idx) => {
          const id = item.id ?? idx;
          const slugPart = item.slug?.trim();
          if (!slugPart) return null;
          const title = formatBoldText(displayIndustryTitle(item));
          const desc = formatBoldText(cleanMeta(item.short_summary_description) || '');
          return {
            id: String(id),
            title,
            href: slugToHref(slugPart),
            iconUrl: mediaUrl(item.short_summary_icon),
            description: desc || undefined,
          };
        })
        .filter(Boolean) as ProductIndustriesIndustry[];

      const featuredProducts: ProductIndustriesFeaturedProduct[] = (data.autofetch?.featured_products || [])
        .map((item, idx) => {
          const id = item.id ?? idx;
          const slugPart = item.slug?.trim();
          const title = cleanMeta(item.title);
          if (!slugPart || !title) return null;
          const description = (item.short_summary_description || '').trim();
          return {
            id: String(id),
            title: formatBoldText(title),
            href: slugToHref(slugPart),
            image: mediaUrl(item.short_summary_image),
            imageAlt: formatBoldText(title),
            description: formatBoldText(description) || undefined,
            subtitle: description ? formatBoldText(subtitleFromDescription(description)) : undefined,
          };
        })
        .filter(Boolean) as ProductIndustriesFeaturedProduct[];

      const page: ProductIndustriesPageData = {
        title: data.title,
        heroBackgroundImage: heroBg,
        heroSubtitle,
        insights,
        industries,
        featuredProducts,
      };

      return {
        slug: data.slug,
        title: data.title,
        seo: data.seo || {},
        page,
      };
    } catch {
      continue;
    }
  }

  return null;
});
