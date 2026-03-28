/**
 * Central API Helper
 * 
 * This module provides a centralized way to interact with the API.
 * Currently uses fake API functions, but can be easily switched to
 * real API calls when the Laravel backend is ready.
 */

import { API_CONFIG } from '@/config/api';
import { getHomepageData as fakeGetHomepageData, type HomepageData } from '@/fake-api/homepage';
import { getPageData as fakeGetPageData, type PageData } from '@/fake-api/pages';
import { 
  getProductData as fakeGetProductData, 
  getAllProductSlugs as fakeGetAllProductSlugs,
  getProductsByCategory as fakeGetProductsByCategory,
  type ProductData
} from '@/fake-api/products';
import {
  getAllCategories as fakeGetAllCategories,
  getCategoryBySlug as fakeGetCategoryBySlug,
  getAllCategorySlugs as fakeGetAllCategorySlugs,
  type ProductCategory
} from '@/fake-api/categories';
import {
  getTechnicalServiceData as fakeGetTechnicalServiceData,
  getAllTechnicalServices as fakeGetAllTechnicalServices,
  getAllTechnicalServiceSlugs as fakeGetAllTechnicalServiceSlugs,
  type TechnicalServiceData
} from '@/fake-api/technical-services';
import {
  getAllMarketingServices as fakeGetAllMarketingServices,
  getMarketingServiceData as fakeGetMarketingServiceData,
  getAllMarketingServiceSlugs as fakeGetAllMarketingServiceSlugs,
  type MarketingServiceData,
  type MarketingServiceHighlight,
} from '@/fake-api/marketing-services';
import {
  getMarketingServicesOverviewData as fakeGetMarketingServicesOverviewData,
  getMarketingLatestNews as fakeGetMarketingLatestNews,
  getMarketingPressNews as fakeGetMarketingPressNews,
  type MarketingServicesOverview,
  type MarketingServicesSeo,
  type MarketingNewsItem,
} from '@/fake-api/marketing-services-overview';
import {
  getTechnicalServicesListingData as fakeGetTechnicalServicesListingData,
  type TechnicalServicesListingData
} from '@/fake-api/technical-services-listing';
import {
  getCompanyData as fakeGetCompanyData,
  type CompanyData
} from '@/fake-api/company';
import {
  getCareersListingData as fakeGetCareersListingData,
  getCareerJobBySlug as fakeGetCareerJobBySlug,
  getAllCareerJobSlugs as fakeGetAllCareerJobSlugs,
  type CareersListingData,
  type CareerJob,
} from '@/fake-api/careers';
import {
  getPackagingPageData as fakeGetPackagingPageData,
  getAllPackagingPages as fakeGetAllPackagingPages,
  getAllPackagingPageSlugs as fakeGetAllPackagingPageSlugs,
  type PackagingPageData,
} from '@/fake-api/packaging-pages';
import { getDynamicPageBySlug as fakeGetDynamicPageBySlug } from '@/fake-api/dynamic-pages';
import { getCanonicalUrl } from '@/config/site';
import {
  getMarketingServiceDetailCandidatePageIds,
  getMarketingServiceDetailPageId,
  normalizeMarketingPathKey,
} from '@/config/marketing-service-detail-pages';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

// Re-export types for convenience
export type {
  ProductData,
  ProductCategory,
  TechnicalServiceData,
  TechnicalServicesListingData,
  CompanyData,
  MarketingServiceData,
  MarketingServicesOverview,
  MarketingServicesSeo,
  MarketingNewsItem,
  CareersListingData,
  CareerJob,
  PackagingPageData,
};
import {
  getHeaderData as fakeGetHeaderData,
  type HeaderData,
  type NavigationItem,
} from '@/fake-api/layout';
import {
  getFooterData as fakeGetFooterData,
  type FooterData,
  type SocialLink,
} from '@/fake-api/layout';

type CompanyProfileApiResponse = {
  data?: {
    id?: number;
    name?: string | null;
    logo?:
      | string
      | {
          id?: number;
          filename?: string;
          url?: string | null;
        }
      | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
    address?: string | null;
    website?: string | null;
    google_map?:
      | string
      | {
          id?: number;
          filename?: string;
          url?: string | null;
        }
      | null;
    meta_title?: string | null;
    meta_description?: string | null;
    is_active?: boolean;
    meta?: Array<Record<string, unknown>>;
    breadcrumb?: string | { url?: string | null } | null;
    breadcrumb_image?: string | { url?: string | null } | null;
    banner?: string | { url?: string | null } | null;
    banner_image?: string | { url?: string | null } | null;
    hero_image?: string | { url?: string | null } | null;
    about_banner?: string | { url?: string | null } | null;
  };
};

type CompanyProfile = {
  name?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  supportEmail?: string;
  salesPartnerEmail?: string;
  technicalSupportEmail?: string;
  careersEmail?: string;
  instagramUrl?: string;
  xUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  vimeoUrl?: string;
  googleMapImage?: string;
  breadcrumbImage?: string;
};

const COMPANY_API_BASE_URL =
  process.env.COMPANY_API_BASE_URL ||
  'https://backend-lamipak.webtesting.pw/api';

const COMPANY_PROFILE_ENDPOINT =
  process.env.COMPANY_PROFILE_ENDPOINT || '/v1/companies/1';

const COMPANY_API_DOMAIN =
  process.env.COMPANY_API_DOMAIN || 'https://backend-lamipak.webtesting.pw';

function buildCompanyApiUrl(endpoint: string): string {
  const base = COMPANY_API_BASE_URL.replace(/\/+$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
}

function normalizeApiAssetUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;

  const domain = COMPANY_API_DOMAIN.replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${domain}${path}`;
}

function extractMediaUrl(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const urlValue = (value as { url?: unknown }).url;
    if (typeof urlValue === 'string') return urlValue;
  }
  return undefined;
}

const MARKETING_SERVICES_PAGE_ID = process.env.MARKETING_SERVICES_PAGE_ID || '1';

type CmsPageSeoRaw = {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  /** CMS may send JSON-LD as a string or a parsed object */
  schema?: string | null | Record<string, unknown>;
  canonical_url?: string | null;
  robots_index?: string | null;
  robots_follow?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: unknown;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: unknown;
  sitemap_priority?: string | number | null;
};

type CompanyPageApiData = {
  id?: number;
  slug?: string;
  title?: string | null;
  layout?: string | null;
  meta?: Record<string, unknown> | null;
  seo?: CmsPageSeoRaw | null;
};

type CompanyPageApiEnvelope = {
  data?: CompanyPageApiData | null;
};

async function fetchCompanyPageById(id: number): Promise<CompanyPageApiData | null> {
  if (!Number.isInteger(id) || id < 1) return null;
  const response = await fetch(buildCompanyApiUrl(`/v1/page/${id}`), {
    next: { revalidate: 60 },
  });
  if (!response.ok) return null;
  const payload = (await response.json()) as CompanyPageApiEnvelope;
  return payload?.data ?? null;
}

/**
 * Optional backend: `GET /v1/page/slug/...` when the API supports lookup by CMS slug.
 */
async function fetchCompanyPageBySlugPath(slugPath: string): Promise<CompanyPageApiData | null> {
  const trimmed = slugPath.replace(/^\/+|\/+$/g, '');
  if (!trimmed) return null;
  const encoded = encodeURIComponent(trimmed);
  const paths = [`/v1/page/slug/${encoded}`, `/v1/page/by-slug/${encoded}`];
  if (trimmed.includes('/')) {
    paths.push(`/v1/page/slug/${trimmed}`);
  }
  for (const p of paths) {
    try {
      const response = await fetch(buildCompanyApiUrl(p), {
        next: { revalidate: 60 },
      });
      if (!response.ok) continue;
      const payload = (await response.json()) as CompanyPageApiEnvelope;
      const data = payload?.data ?? null;
      if (data && typeof data === 'object') return data;
    } catch {
      // ignore network errors
    }
  }
  return null;
}

/** Parses `MARKETING_SERVICE_DETAIL_PAGE_ID_RANGE`: `1-40`, `6,7,8`, `1-10,15-20`. Default `1-60` when unset; empty string = off. */
function parseMarketingDetailPageIdRange(): number[] {
  const raw = process.env.MARKETING_SERVICE_DETAIL_PAGE_ID_RANGE;
  const s = raw === undefined ? '1-60' : raw.trim();
  if (s === '') return [];
  const out = new Set<number>();
  const cap = 500;
  for (const part of s.split(',')) {
    const p = part.trim();
    if (!p) continue;
    const rangeMatch = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const a = Number(rangeMatch[1]);
      const b = Number(rangeMatch[2]);
      const lo = Math.min(a, b);
      const hi = Math.min(Math.max(a, b), cap);
      for (let i = Math.max(1, lo); i <= hi; i++) out.add(i);
    } else {
      const n = Number(p);
      if (Number.isInteger(n) && n > 0 && n <= cap) out.add(n);
    }
  }
  return [...out].sort((a, b) => a - b);
}

const getMarketingServiceDetailPageIdsResolvedInner = unstable_cache(
  async (): Promise<number[]> => {
    const manual = getMarketingServiceDetailCandidatePageIds();
    const fromRange = parseMarketingDetailPageIdRange();
    const found = new Set<number>(manual);
    for (const id of fromRange) {
      const row = await fetchCompanyPageById(id);
      if (row?.layout === 'marketing_service_detail' && row.meta) {
        found.add(id);
      }
    }
    return [...found].sort((a, b) => a - b);
  },
  [
    'marketing-service-detail-page-ids-resolved',
    process.env.MARKETING_SERVICE_DETAIL_PAGE_ID_RANGE ?? 'default',
    process.env.MARKETING_SERVICE_DETAIL_PAGE_IDS ?? '',
    process.env.MARKETING_SERVICE_DETAIL_PAGE_CANDIDATE_IDS ?? '',
  ],
  {
    revalidate: 120,
    tags: ['cms-marketing-service-detail-pages'],
  },
);

/** Manual map + env ids + optional id-range scan for `marketing_service_detail` pages (cached). */
async function getMarketingServiceDetailPageIdsResolved(): Promise<number[]> {
  return getMarketingServiceDetailPageIdsResolvedInner();
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function pickString(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function splitHighlightsTitle(full: string): { heading: string; sub: string } {
  const m = full.match(/^(.+?)\s+with\s+(.+)$/i);
  if (m) return { heading: m[1].trim(), sub: m[2].trim() };
  return { heading: full.trim(), sub: '' };
}

function coerceStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}

function parseHighlightsItems(
  raw: unknown,
): MarketingServicesOverview['stats'] {
  if (raw == null) return [];
  let parsed: Record<string, unknown>;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return [];
    }
  } else if (typeof raw === 'object') {
    parsed = raw as Record<string, unknown>;
  } else {
    return [];
  }
  const icons = coerceStringArray(parsed.icon ?? parsed.Icon);
  const values = coerceStringArray(parsed.value);
  const titles = coerceStringArray(parsed.title);
  const n = Math.max(values.length, titles.length, icons.length);
  if (n === 0) return [];
  const fallbacks = ['/globe_icon.svg', '/suppoer_icon.svg', '/employee.svg', '/process.svg'];
  const out: MarketingServicesOverview['stats'] = [];
  for (let i = 0; i < n; i++) {
    const value = values[i] ?? '';
    const label = titles[i] ?? '';
    if (!value && !label) continue;
    const iconRaw = icons[i];
    let iconUrl: string;
    if (iconRaw && /^https?:\/\//i.test(iconRaw)) {
      iconUrl = iconRaw;
    } else if (iconRaw && /\.(svg|png|jpe?g|webp|gif)$/i.test(iconRaw)) {
      iconUrl = normalizeApiAssetUrl(iconRaw) ?? iconRaw;
    } else {
      iconUrl = fallbacks[i % fallbacks.length];
    }
    out.push({
      id: `highlight-${i}`,
      icon: iconUrl,
      value,
      label,
    });
  }
  return out;
}

function mapMarketingSeoFromApi(raw: CmsPageSeoRaw | null | undefined): MarketingServicesSeo | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const out: MarketingServicesSeo = {
    title: raw.title?.trim() || null,
    description: raw.description?.trim() || null,
    keywords: raw.keywords?.trim() || null,
    schema:
      typeof raw.schema === 'string'
        ? raw.schema
        : raw.schema != null && typeof raw.schema === 'object'
          ? JSON.stringify(raw.schema)
          : null,
    canonicalUrl: raw.canonical_url?.trim() || null,
    robotsIndex: raw.robots_index?.trim() || null,
    robotsFollow: raw.robots_follow?.trim() || null,
    ogTitle: raw.og_title?.trim() || null,
    ogDescription: raw.og_description?.trim() || null,
    ogImageUrl: extractMediaUrl(raw.og_image),
    twitterTitle: raw.twitter_title?.trim() || null,
    twitterDescription: raw.twitter_description?.trim() || null,
    twitterImageUrl: extractMediaUrl(raw.twitter_image),
    sitemapPriority:
      raw.sitemap_priority != null && String(raw.sitemap_priority).trim() !== ''
        ? String(raw.sitemap_priority)
        : null,
  };
  const has =
    out.title ||
    out.description ||
    out.keywords ||
    out.schema ||
    out.canonicalUrl ||
    out.robotsIndex ||
    out.robotsFollow ||
    out.ogTitle ||
    out.ogDescription ||
    out.ogImageUrl ||
    out.twitterTitle ||
    out.twitterDescription ||
    out.twitterImageUrl ||
    out.sitemapPriority;
  return has ? out : undefined;
}

function splitDetailHeroTitle(full: string): { heading: string; headingHighlight: string } {
  const m = full.match(/^(.+?)\s+with\s+(.+)$/i);
  if (m) return { heading: m[1].trim(), headingHighlight: m[2].trim() };
  return { heading: '', headingHighlight: full.trim() };
}

function buildIntroParagraphsFromHeroHtml(shortSummary: string, heroHtml: string): string[] {
  if (heroHtml.trim()) {
    return stripHtml(heroHtml.replace(/<br\s*\/?>/gi, '\n'))
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (shortSummary.trim()) return [shortSummary.trim()];
  return [];
}

function parseTitleDescriptionIconBlocks(
  raw: unknown,
  idPrefix: string,
): Array<{ id: string; title: string; body: string; icon?: string }> {
  if (!raw || typeof raw !== 'object') return [];
  const o = raw as Record<string, unknown>;
  const titles = coerceStringArray(o.title);
  const bodies = coerceStringArray(o.description);
  const iconsRaw = Array.isArray(o.icon) ? o.icon : [];
  const n = Math.max(titles.length, bodies.length, iconsRaw.length);
  const out: Array<{ id: string; title: string; body: string; icon?: string }> = [];
  for (let i = 0; i < n; i++) {
    out.push({
      id: `${idPrefix}-${i}`,
      title: titles[i] || '',
      body: bodies[i] || '',
      icon: extractMediaUrl(iconsRaw[i]),
    });
  }
  return out.filter((x) => x.title || x.body);
}

function mapMarketingServiceDetailPage(
  row: CompanyPageApiData,
  pathKeyForFallback: string,
): MarketingServiceData | null {
  const meta = row.meta;
  if (!meta || typeof meta !== 'object') return null;

  const apiSlug = pickString(row.slug);
  const slugSegments = apiSlug.split('/').filter(Boolean);
  const fallbackSegments = pathKeyForFallback.split('/').filter(Boolean);
  const lastSegment =
    slugSegments.length > 0
      ? slugSegments[slugSegments.length - 1]!
      : fallbackSegments.length > 0
        ? fallbackSegments[fallbackSegments.length - 1]!
        : 'service';

  const cmsPath =
    cmsSlugToListingPath(apiSlug) ||
    (pathKeyForFallback.includes('/') ? cmsSlugToListingPath(pathKeyForFallback) : null);

  const shortSummaryImage = extractMediaUrl(meta.short_summary_image);
  const heroImage = extractMediaUrl(meta.hero_image) || shortSummaryImage;
  const breadcrumb = extractMediaUrl(meta.breadcrumb_image);

  const heroTitleStr = pickString(meta.hero_title);
  const shortTitle = pickString(meta.short_summary_title);
  const { heading, headingHighlight } = splitDetailHeroTitle(
    heroTitleStr || shortTitle || pickString(row.title) || '',
  );

  const shortSummaryDesc = pickString(meta.short_summary_description);
  const heroDescHtml = typeof meta.hero_description === 'string' ? meta.hero_description.trim() : '';
  const paragraphs = buildIntroParagraphsFromHeroHtml(shortSummaryDesc, heroDescHtml);

  const videoUrlRaw = pickString(meta.video_url);
  const heroNav = pickString(meta.hero_navigation_url);

  const hlBlocks = parseTitleDescriptionIconBlocks(meta.highlights_items, 'hl');
  const highlights: MarketingServiceHighlight[] = hlBlocks.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.body,
    icon: b.icon,
  }));

  const bjBlocks = parseTitleDescriptionIconBlocks(meta.brand_journey_items, 'bj');
  const brandJourney =
    bjBlocks.length > 0
      ? {
          heading: 'Elevate Your',
          headingHighlight: 'Brand Journey',
          items: bjBlocks.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.body,
            icon: b.icon || '',
          })),
        }
      : undefined;

  const seoRaw = row.seo;
  const pageTitle = pickString(row.title) || 'Marketing Service';
  const metaTitle = pickString(seoRaw?.title) || pageTitle;
  const metaDesc =
    pickString(seoRaw?.description) || shortSummaryDesc || stripHtml(heroDescHtml) || pageTitle;
  const canonicalPath =
    pickString(seoRaw?.canonical_url) || cmsPath || `/marketing-services/${lastSegment}`;

  const cmsSeoFull = mapMarketingSeoFromApi(row.seo ?? undefined);

  return {
    slug: lastSegment,
    cmsDetailPath: cmsPath ?? undefined,
    title: pageTitle,
    shortDescription: shortSummaryDesc || stripHtml(heroDescHtml),
    description: stripHtml(heroDescHtml) || shortSummaryDesc,
    heroBackgroundImage: breadcrumb || heroImage,
    listingImage: shortSummaryImage || heroImage || '',
    listingImageAlt: shortTitle || pageTitle,
    introSection: {
      heading,
      headingHighlight,
      paragraphs,
      image: heroImage || shortSummaryImage || '',
      imageAlt: shortTitle || pageTitle,
      ctaText: 'Learn more',
      ctaLink: heroNav || '#',
    },
    brandJourney,
    seo: {
      meta_title: metaTitle,
      meta_description: metaDesc,
      canonical_url: canonicalPath,
    },
    ...(cmsSeoFull ? { cmsSeo: cmsSeoFull } : {}),
    highlights,
    ...(videoUrlRaw ? { videoUrl: videoUrlRaw } : {}),
  };
}

function mapMarketingServicesPageToOverview(
  data: CompanyPageApiData,
  fallback: MarketingServicesOverview,
): MarketingServicesOverview {
  const meta = data.meta ?? {};
  const breadcrumbUrl = extractMediaUrl(meta.breadcrumb_image);
  const heroImageUrl = extractMediaUrl(meta.hero_image);
  /** Section heading beside the 360° graphic — CMS `hero_title` */
  const heroTitle = pickString(meta.hero_title);
  const shortSummaryTitle = pickString(meta.short_summary_title);
  const shortSummaryDesc = pickString(meta.short_summary_description);
  const heroDescRaw =
    typeof meta.hero_description === 'string' ? meta.hero_description.trim() : '';
  const heroDescriptionHtml = heroDescRaw ? heroDescRaw : undefined;
  const description =
    shortSummaryDesc ||
    (heroDescRaw ? stripHtml(heroDescRaw) : '') ||
    fallback.description;

  const highlightsTitle = pickString(meta.highlights_title);
  const { heading: statsHeading, sub: statsSubheading } = highlightsTitle
    ? splitHighlightsTitle(highlightsTitle)
    : { heading: fallback.statsHeading, sub: fallback.statsSubheading };

  const parsedStats = parseHighlightsItems(meta.highlights_items);

  return {
    ...fallback,
    pageTitle: pickString(data.title) || fallback.pageTitle,
    seo: mapMarketingSeoFromApi(data.seo ?? undefined),
    heroBackgroundImage: breadcrumbUrl || heroImageUrl || fallback.heroBackgroundImage,
    heading: heroTitle || shortSummaryTitle || fallback.heading,
    description,
    heroDescriptionHtml,
    image: heroImageUrl || fallback.image,
    imageAlt: heroTitle || shortSummaryTitle || pickString(data.title) || fallback.imageAlt,
    statsHeading: statsHeading || fallback.statsHeading,
    statsSubheading: statsSubheading || fallback.statsSubheading,
    stats: parsedStats.length > 0 ? parsedStats : fallback.stats,
  };
}

/** Normalize CMS page slug to a pathname (e.g. `servies/marketing-service` → `/servies/marketing-service`). */
function cmsSlugToListingPath(slug: string | undefined | null): string | null {
  const s = typeof slug === 'string' ? slug.trim() : '';
  if (!s) return null;
  const clean = s.replace(/^\/+|\/+$/g, '');
  if (!clean) return null;
  return `/${clean}`;
}

type MarketingServicesCmsPayload = {
  overview: MarketingServicesOverview;
  /** Canonical pathname for the listing page from API `slug` */
  listingPath: string;
};

const getMarketingServicesCmsPayload = cache(
  async (): Promise<MarketingServicesCmsPayload | null> => {
    const pageId = Number(MARKETING_SERVICES_PAGE_ID);
    if (Number.isNaN(pageId) || pageId < 1) return null;

    const row = await fetchCompanyPageById(pageId);
    if (!row || row.layout !== 'marketing_services' || !row.meta) return null;

    const fallback = await fakeGetMarketingServicesOverviewData();
    const overview = mapMarketingServicesPageToOverview(row, fallback);
    const listingPath = cmsSlugToListingPath(row.slug) ?? '/marketing-services';

    return { overview, listingPath };
  },
);

/**
 * Public URL path for the marketing services listing (from CMS `slug`, else `/marketing-services`).
 */
export async function getMarketingServicesListingPath(): Promise<string> {
  const payload = await getMarketingServicesCmsPayload();
  if (payload) return payload.listingPath;
  return '/marketing-services';
}

/**
 * Whether to load marketing service detail from CMS for this path.
 * Uses the static path→id map, or any URL under the marketing listing `slug` prefix
 * (e.g. `marketing-support-service/...` from the API) so CMS slug changes still resolve.
 */
/** When listing CMS path is unavailable, still treat these parent segments as detail pages */
const FALLBACK_MARKETING_DETAIL_PARENT_SEGMENTS = ['marketing-support-service'];

export const shouldTryFetchMarketingServiceDetail = cache(async function shouldTryFetchMarketingServiceDetail(
  fullSlug: string,
): Promise<boolean> {
  const normalized = normalizeMarketingPathKey(fullSlug);
  if (!normalized) return false;
  if (getMarketingServiceDetailPageId(fullSlug) != null) return true;
  const listingPath = await getMarketingServicesListingPath();
  const prefix = normalizeMarketingPathKey(listingPath);
  if (prefix && normalized.startsWith(`${prefix}/`)) return true;
  for (const seg of FALLBACK_MARKETING_DETAIL_PARENT_SEGMENTS) {
    if (normalized.startsWith(`${seg}/`)) return true;
  }
  return false;
});

/**
 * Checks if we should use the real API or fake API
 */
const useRealAPI = (): boolean => {
  return Boolean(API_CONFIG.baseUrl);
};

async function fetchCompanyProfile(): Promise<CompanyProfile | null> {
  try {
    const response = await fetch(buildCompanyApiUrl(COMPANY_PROFILE_ENDPOINT), {
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as CompanyProfileApiResponse;
    const raw = payload?.data;
    if (!raw || raw.is_active === false) return null;

    const rawLogoUrl =
      typeof raw.logo === 'string'
        ? raw.logo
        : raw.logo && typeof raw.logo === 'object'
          ? raw.logo.url || undefined
          : undefined;

    const rawGoogleMapUrl =
      typeof raw.google_map === 'string'
        ? raw.google_map
        : raw.google_map && typeof raw.google_map === 'object'
          ? raw.google_map.url || undefined
          : undefined;

    const supportEmail =
      raw.meta?.find(
        (item) => !!item && typeof item === 'object' && typeof item.support_email === 'string',
      )?.support_email as string | undefined;

    const breadcrumbMeta = raw.meta?.find(
      (item) =>
        !!item &&
        typeof item === 'object' &&
        !!item.breadcrumb &&
        typeof item.breadcrumb === 'object',
    ) as { breadcrumb?: { url?: string | null } } | undefined;

    const metaBannerItem = raw.meta?.find(
      (item) =>
        !!item &&
        typeof item === 'object' &&
        ('breadcrumb' in item ||
          'breadcrumb_image' in item ||
          'banner' in item ||
          'banner_image' in item ||
          'hero_image' in item ||
          'about_banner' in item),
    ) as Record<string, unknown> | undefined;

    const rawHeroBannerUrl =
      extractMediaUrl(raw.breadcrumb) ||
      extractMediaUrl(raw.breadcrumb_image) ||
      extractMediaUrl(raw.banner) ||
      extractMediaUrl(raw.banner_image) ||
      extractMediaUrl(raw.hero_image) ||
      extractMediaUrl(raw.about_banner) ||
      extractMediaUrl(metaBannerItem?.breadcrumb) ||
      extractMediaUrl(metaBannerItem?.breadcrumb_image) ||
      extractMediaUrl(metaBannerItem?.banner) ||
      extractMediaUrl(metaBannerItem?.banner_image) ||
      extractMediaUrl(metaBannerItem?.hero_image) ||
      extractMediaUrl(metaBannerItem?.about_banner) ||
      breadcrumbMeta?.breadcrumb?.url ||
      undefined;

    const salesPartnerEmail =
      raw.meta?.find(
        (item) =>
          !!item && typeof item === 'object' && typeof item.sales_partner_email === 'string',
      )?.sales_partner_email as string | undefined;

    const technicalSupportEmail =
      raw.meta?.find(
        (item) =>
          !!item && typeof item === 'object' && typeof item.technical_support_email === 'string',
      )?.technical_support_email as string | undefined;

    const careersEmail =
      raw.meta?.find(
        (item) => !!item && typeof item === 'object' && typeof item.careers_email === 'string',
      )?.careers_email as string | undefined;

    const instagramUrl =
      raw.meta?.find(
        (item) => !!item && typeof item === 'object' && typeof item.instagram_url === 'string',
      )?.instagram_url as string | undefined;

    const xUrl =
      raw.meta?.find((item) => !!item && typeof item === 'object' && typeof item.x_url === 'string')
        ?.x_url as string | undefined;

    const linkedinUrl =
      raw.meta?.find(
        (item) => !!item && typeof item === 'object' && typeof item.linkedin_url === 'string',
      )?.linkedin_url as string | undefined;

    const facebookUrl =
      raw.meta?.find(
        (item) => !!item && typeof item === 'object' && typeof item.facebook_url === 'string',
      )?.facebook_url as string | undefined;

    const youtubeUrl =
      raw.meta?.find(
        (item) => !!item && typeof item === 'object' && typeof item.youtube_url === 'string',
      )?.youtube_url as string | undefined;

    const tiktokUrl =
      raw.meta?.find(
        (item) => !!item && typeof item === 'object' && typeof item.tiktok_url === 'string',
      )?.tiktok_url as string | undefined;

    const vimeoUrl =
      raw.meta?.find(
        (item) => !!item && typeof item === 'object' && typeof item.vimeo_url === 'string',
      )?.vimeo_url as string | undefined;

    return {
      name: raw.name || undefined,
      logo: normalizeApiAssetUrl(rawLogoUrl),
      email: raw.email || undefined,
      phone: raw.phone || undefined,
      address: raw.address || undefined,
      website: raw.website || undefined,
      supportEmail,
      salesPartnerEmail,
      technicalSupportEmail,
      careersEmail,
      instagramUrl,
      xUrl,
      linkedinUrl,
      facebookUrl,
      youtubeUrl,
      tiktokUrl,
      vimeoUrl,
      googleMapImage: normalizeApiAssetUrl(rawGoogleMapUrl),
      breadcrumbImage: normalizeApiAssetUrl(rawHeroBannerUrl),
    };
  } catch {
    return null;
  }
}

export async function fetchCompanyProfileData(): Promise<CompanyProfile | null> {
  return fetchCompanyProfile();
}

/**
 * Fetches homepage data
 * 
 * @returns Promise<HomepageData>
 */
export async function fetchHomepageData(): Promise<HomepageData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.homepage}`);
    // if (!response.ok) throw new Error('Failed to fetch homepage data');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetHomepageData();
}

/**
 * Fetches page data by slug
 * 
 * @param slug - The page slug
 * @returns Promise<PageData | null>
 */
export async function fetchPageData(slug: string): Promise<PageData | null> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.page(slug)}`);
    // if (!response.ok) {
    //   if (response.status === 404) return null;
    //   throw new Error('Failed to fetch page data');
    // }
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetPageData(slug);
}

/** Rewrites `/marketing-services` nav hrefs to the CMS listing path (nested menus included). */
function withMarketingServicesListingHref(
  items: NavigationItem[],
  listingPath: string,
): NavigationItem[] {
  return items.map((item) => ({
    ...item,
    href: item.href === '/marketing-services' ? listingPath : item.href,
    children: item.children?.length
      ? withMarketingServicesListingHref(item.children, listingPath)
      : item.children,
  }));
}

/**
 * Fetches header data
 *
 * @returns Promise<HeaderData>
 */
export async function fetchHeaderData(): Promise<HeaderData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.header}`);
    // if (!response.ok) throw new Error('Failed to fetch header data');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  const [fallback, companyProfile, listingPath] = await Promise.all([
    fakeGetHeaderData(),
    fetchCompanyProfile(),
    getMarketingServicesListingPath(),
  ]);

  const base: HeaderData = !companyProfile
    ? fallback
    : {
        ...fallback,
        logo: {
          ...fallback.logo,
          text: companyProfile.name || fallback.logo.text,
          image: companyProfile.logo || fallback.logo.image,
        },
      };

  return {
    ...base,
    navigation: withMarketingServicesListingHref(base.navigation, listingPath),
  };
}

function mergeFooterSocialLinks(fallback: SocialLink[], profile: CompanyProfile | null): SocialLink[] {
  if (!profile) return fallback;

  const overrideByIcon: Partial<Record<string, string | undefined>> = {
    x: profile.xUrl,
    twitter: profile.xUrl,
    linkedin: profile.linkedinUrl,
    facebook: profile.facebookUrl,
    instagram: profile.instagramUrl,
    youtube: profile.youtubeUrl,
    tiktok: profile.tiktokUrl,
    vimeo: profile.vimeoUrl,
  };

  return fallback.map((link) => {
    const key = link.icon || '';
    const next = overrideByIcon[key];
    return next ? { ...link, href: next } : link;
  });
}

/**
 * Fetches footer data
 * 
 * @returns Promise<FooterData>
 */
export async function fetchFooterData(): Promise<FooterData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.footer}`);
    // if (!response.ok) throw new Error('Failed to fetch footer data');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  const fallback = await fakeGetFooterData();
  const companyProfile = await fetchCompanyProfile();
  if (!companyProfile) {
    return fallback;
  }

  const contactLinks = [
    companyProfile.address
      ? { id: 'api-contact-address', label: `Address: ${companyProfile.address}`, href: '#' }
      : null,
    companyProfile.phone
      ? {
          id: 'api-contact-phone',
          label: `Phone: ${companyProfile.phone}`,
          href: `tel:${companyProfile.phone}`,
        }
      : null,
    companyProfile.email
      ? {
          id: 'api-contact-email',
          label: `Email: ${companyProfile.email}`,
          href: `mailto:${companyProfile.email}`,
        }
      : null,
  ].filter(Boolean) as FooterData['columns'][number]['links'];

  const mappedColumns =
    contactLinks.length > 0
      ? fallback.columns.map((column) =>
          column.title === 'Contact'
            ? {
                ...column,
                links: contactLinks,
              }
            : column,
        )
      : fallback.columns;

  return {
    ...fallback,
    logo: {
      ...fallback.logo,
      text: companyProfile.name || fallback.logo.text,
      image: companyProfile.logo || fallback.logo.image,
    },
    description: fallback.description,
    columns: mappedColumns,
    socialLinks: mergeFooterSocialLinks(fallback.socialLinks ?? [], companyProfile),
  };
}

/**
 * Fetches product data by slug
 * 
 * @param slug - The product slug
 * @returns Promise<ProductData | null>
 */
export async function fetchProductData(slug: string): Promise<ProductData | null> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.product(slug)}`);
    // if (!response.ok) {
    //   if (response.status === 404) return null;
    //   throw new Error('Failed to fetch product data');
    // }
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetProductData(slug);
}

/**
 * Gets all product slugs (for static generation)
 * 
 * @returns Promise<string[]>
 */
export async function getAllProductSlugs(): Promise<string[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.products}`);
    // if (!response.ok) throw new Error('Failed to fetch products');
    // const data = await response.json();
    // return data.map((product: ProductData) => product.slug);
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetAllProductSlugs();
}

/**
 * Gets all product categories
 * 
 * @returns Promise<ProductCategory[]>
 */
export async function getAllCategories(): Promise<ProductCategory[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.categories}`);
    // if (!response.ok) throw new Error('Failed to fetch categories');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetAllCategories();
}

/**
 * Gets category by slug
 * 
 * @param slug - The category slug
 * @returns Promise<ProductCategory | null>
 */
export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.category(slug)}`);
    // if (!response.ok) {
    //   if (response.status === 404) return null;
    //   throw new Error('Failed to fetch category');
    // }
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetCategoryBySlug(slug);
}

/**
 * Gets all category slugs (for static generation)
 * 
 * @returns Promise<string[]>
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.categories}`);
    // if (!response.ok) throw new Error('Failed to fetch categories');
    // const data = await response.json();
    // return data.map((category: ProductCategory) => category.slug);
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetAllCategorySlugs();
}

/**
 * Gets products by category slug
 * 
 * @param categorySlug - The category slug
 * @returns Promise<ProductData[]>
 */
export async function getProductsByCategory(categorySlug: string): Promise<ProductData[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.productsByCategory(categorySlug)}`);
    // if (!response.ok) throw new Error('Failed to fetch products by category');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetProductsByCategory(categorySlug);
}

/**
 * Fetches technical service data by slug
 * 
 * @param slug - The technical service slug
 * @returns Promise<TechnicalServiceData | null>
 */
export async function fetchTechnicalServiceData(slug: string): Promise<TechnicalServiceData | null> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.technicalService(slug)}`);
    // if (!response.ok) {
    //   if (response.status === 404) return null;
    //   throw new Error('Failed to fetch technical service data');
    // }
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetTechnicalServiceData(slug);
}

/**
 * Gets all technical services
 * 
 * @returns Promise<TechnicalServiceData[]>
 */
export async function getAllTechnicalServices(): Promise<TechnicalServiceData[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.technicalServices}`);
    // if (!response.ok) throw new Error('Failed to fetch technical services');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetAllTechnicalServices();
}

/**
 * Gets all technical service slugs (for static generation)
 * 
 * @returns Promise<string[]>
 */
export async function getAllTechnicalServiceSlugs(): Promise<string[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.technicalServices}`);
    // if (!response.ok) throw new Error('Failed to fetch technical services');
    // const data = await response.json();
    // return data.map((service: TechnicalServiceData) => service.slug);
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetAllTechnicalServiceSlugs();
}

/**
 * Fetches technical services listing page data
 * 
 * @returns Promise<TechnicalServicesListingData>
 */
export async function fetchTechnicalServicesListingData(): Promise<TechnicalServicesListingData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.technicalServicesListing}`);
    // if (!response.ok) throw new Error('Failed to fetch technical services listing data');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetTechnicalServicesListingData();
}

/**
 * Fetches company/about us page data
 * 
 * @returns Promise<CompanyData>
 */
export async function fetchCompanyData(): Promise<CompanyData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.company}`);
    // if (!response.ok) throw new Error('Failed to fetch company data');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  // Source company content through dynamic page API payload.
  // For About Us hero we want the exact banner + title from `fake-api/company.ts`.
  const dynamicCompanyPage = await fakeGetDynamicPageBySlug('our-company');
  const localCompanyData = await fakeGetCompanyData();
  const baseCompanyData = dynamicCompanyPage?.ourCompanyData ?? localCompanyData;

  const companyProfile = await fetchCompanyProfile();
  if (!companyProfile) {
    return baseCompanyData;
  }

  return {
    ...baseCompanyData,
    hero: {
      ...baseCompanyData.hero,
      title: localCompanyData.hero.title,
      backgroundImage: localCompanyData.hero.backgroundImage,
    },
  };
}

/**
 * Fetch careers listing data (server-side)
 */
export async function fetchCareersListingData(): Promise<CareersListingData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.careers}`);
    // if (!response.ok) throw new Error('Failed to fetch careers');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  return fakeGetCareersListingData();
}

/**
 * Fetch single career job by slug (server-side)
 */
export async function fetchCareerJobBySlug(slug: string): Promise<CareerJob | null> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.career(slug)}`);
    // if (!response.ok) {
    //   if (response.status === 404) return null;
    //   throw new Error('Failed to fetch career job');
    // }
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  return fakeGetCareerJobBySlug(slug);
}

/**
 * Get all career job slugs (for static generation)
 */
export async function getAllCareerJobSlugs(): Promise<string[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.careers}`);
    // if (!response.ok) throw new Error('Failed to fetch careers');
    // const data = await response.json();
    // return data.map((job: CareerJob) => job.slug);
    throw new Error('Real API not yet implemented');
  }

  return fakeGetAllCareerJobSlugs();
}

/**
 * Fetches marketing services overview content (listing hero section).
 * Uses CMS `GET /v1/page/:id` (see `MARKETING_SERVICES_PAGE_ID`, default `1`) when the
 * page `layout` is `marketing_services`; otherwise falls back to fake data.
 */
export const fetchMarketingServicesOverviewData = cache(async function fetchMarketingServicesOverviewData(): Promise<MarketingServicesOverview> {
  const payload = await getMarketingServicesCmsPayload();
  if (payload) return payload.overview;
  return fakeGetMarketingServicesOverviewData();
});

/**
 * Fetches latest marketing news for marketing services listing page
 *
 * @returns Promise<MarketingNewsItem[]>
 */
export async function fetchMarketingLatestNews(): Promise<MarketingNewsItem[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.marketingLatestNews}`);
    // if (!response.ok) throw new Error('Failed to fetch marketing latest news');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  return fakeGetMarketingLatestNews();
}

/**
 * Fetches press release & event news for marketing services listing page
 *
 * @returns Promise<MarketingNewsItem[]>
 */
export async function fetchMarketingPressNews(): Promise<MarketingNewsItem[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.marketingPressNews}`);
    // if (!response.ok) throw new Error('Failed to fetch marketing press news');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  return fakeGetMarketingPressNews();
}

/**
 * Fetch packaging page data by slug
 */
export async function fetchPackagingPageData(slug: string): Promise<PackagingPageData | null> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.packagingPage(slug)}`);
    // if (!response.ok) {
    //   if (response.status === 404) return null;
    //   throw new Error('Failed to fetch packaging page data');
    // }
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  return fakeGetPackagingPageData(slug);
}

/**
 * Get all packaging page slugs (for static generation)
 */
export async function getAllPackagingPageSlugs(): Promise<string[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.packagingPages}`);
    // if (!response.ok) throw new Error('Failed to fetch packaging pages');
    // const data = await response.json();
    // return data.map((p: PackagingPageData) => p.slug);
    throw new Error('Real API not yet implemented');
  }

  return fakeGetAllPackagingPageSlugs();
}

/**
 * Fetch all packaging pages (server-side)
 */
export async function getAllPackagingPages(): Promise<PackagingPageData[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.packagingPages}`);
    // if (!response.ok) throw new Error('Failed to fetch packaging pages');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  return fakeGetAllPackagingPages();
}

/**
 * Fetches all marketing services
 *
 * @returns Promise<MarketingServiceData[]>
 */
export async function getAllMarketingServices(): Promise<MarketingServiceData[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.marketingServices}`);
    // if (!response.ok) throw new Error('Failed to fetch marketing services');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }

  return fakeGetAllMarketingServices();
}

/** Override listing card title, copy, and image from each detail page’s `meta` short summary fields. */
function mergeCmsShortSummaryIntoListingRow(
  service: MarketingServiceData,
  row: CompanyPageApiData,
): Partial<MarketingServiceData> {
  const meta = row.meta;
  if (!meta || typeof meta !== 'object') return {};
  const m = meta as Record<string, unknown>;
  const summaryTitle = pickString(m.short_summary_title);
  const summaryDescRaw = pickString(m.short_summary_description);
  const summaryImg = extractMediaUrl(m.short_summary_image);
  const patch: Partial<MarketingServiceData> = {};
  if (summaryTitle) patch.title = summaryTitle;
  if (summaryDescRaw) {
    patch.shortDescription = summaryDescRaw.includes('<')
      ? stripHtml(summaryDescRaw)
      : summaryDescRaw;
  }
  if (summaryImg) {
    patch.listingImage = summaryImg;
    patch.listingImageAlt = summaryTitle || pickString(row.title) || service.title;
  }
  return patch;
}

/**
 * Listing page rows: merges `short_summary_title`, `short_summary_description`, `short_summary_image`
 * from matched `GET /v1/page/:id` detail `meta`, and sets `cmsDetailPath` from API `slug`.
 */
export const fetchMarketingServicesForListing = cache(async function fetchMarketingServicesForListing(): Promise<
  MarketingServiceData[]
> {
  const [services, listingPath] = await Promise.all([
    getAllMarketingServices(),
    getMarketingServicesListingPath(),
  ]);
  const listingSeg = normalizeMarketingPathKey(listingPath);

  const resolvedIds = await getMarketingServiceDetailPageIdsResolved();
  const detailRows: { id: number; row: CompanyPageApiData }[] = [];
  for (const id of resolvedIds) {
    const row = await fetchCompanyPageById(id);
    if (row?.layout === 'marketing_service_detail' && row.meta) {
      detailRows.push({ id, row });
    }
  }

  const pathnameByPageId = new Map<number, string>();
  for (const { id, row } of detailRows) {
    const p = cmsSlugToListingPath(pickString(row.slug));
    if (p) pathnameByPageId.set(id, p);
  }

  /** CMS last path segment may be `recipe-support11` while the listing row still uses `recipe-support`. */
  const cmsSlugLastSegmentMatchesServiceSlug = (
    apiLastSegment: string,
    serviceSlug: string,
  ): boolean => {
    if (apiLastSegment === serviceSlug) return true;
    if (!apiLastSegment.startsWith(serviceSlug)) return false;
    if (apiLastSegment.length === serviceSlug.length) return true;
    const next = apiLastSegment[serviceSlug.length];
    return next === '-' || next === '_' || /\d/.test(next);
  };

  const resolvePageId = (service: MarketingServiceData): number | null => {
    if (
      service.cmsDetailPageId != null &&
      pathnameByPageId.has(service.cmsDetailPageId)
    ) {
      return service.cmsDetailPageId;
    }
    let pid = getMarketingServiceDetailPageId(service.slug);
    if (pid != null) return pid;
    if (listingSeg) {
      pid = getMarketingServiceDetailPageId(`${listingSeg}/${service.slug}`);
      if (pid != null) return pid;
    }
    for (const { id, row } of detailRows) {
      const apiSlug = pickString(row.slug);
      const last = apiSlug.split('/').filter(Boolean).pop();
      if (last && cmsSlugLastSegmentMatchesServiceSlug(last, service.slug)) return id;
    }
    const titleKey = service.title.trim().toLowerCase();
    if (titleKey) {
      for (const { id, row } of detailRows) {
        const t = pickString(row.title).toLowerCase();
        if (t && t === titleKey) return id;
        const meta = row.meta as Record<string, unknown> | undefined;
        const st = meta ? pickString(meta.short_summary_title).toLowerCase() : '';
        if (st && st === titleKey) return id;
      }
    }
    return null;
  };

  return services.map((service) => {
    const pid = resolvePageId(service);
    if (pid == null) return service;
    const detail = detailRows.find((d) => d.id === pid);
    const href = pathnameByPageId.get(pid);

    let next: MarketingServiceData = { ...service };
    if (detail?.row) {
      const patch = mergeCmsShortSummaryIntoListingRow(service, detail.row);
      next = { ...next, ...patch };
    }
    if (href) {
      next = { ...next, cmsDetailPath: href };
    }
    return next;
  });
});

/**
 * Fetches single marketing service by slug (`/marketing-services/[slug]` or nested CMS path).
 * 1) Static path→id map → `GET /v1/page/:id`
 * 2) Optional `GET /v1/page/slug/...` when the backend supports slug lookup
 * 3) Resolved page ids (manual map + env + id-range scan for `marketing_service_detail`) — `slug` must match URL
 * 4) Fake data for legacy single-segment slugs when CMS does not match
 */
export const fetchMarketingServiceData = cache(async function fetchMarketingServiceData(
  slug: string,
): Promise<MarketingServiceData | null> {
  const normalized = normalizeMarketingPathKey(slug);

  const mapRowToDetail = (row: CompanyPageApiData): MarketingServiceData | null => {
    if (row.layout !== 'marketing_service_detail' || !row.meta) return null;
    return mapMarketingServiceDetailPage(row, slug) ?? null;
  };

  const pageIdFromMap = getMarketingServiceDetailPageId(slug);
  if (pageIdFromMap != null) {
    const row = await fetchCompanyPageById(pageIdFromMap);
    if (row) {
      const mapped = mapRowToDetail(row);
      if (mapped) return mapped;
    }
  }

  if (normalized.includes('/')) {
    const bySlug = await fetchCompanyPageBySlugPath(normalized);
    if (bySlug) {
      const mapped = mapRowToDetail(bySlug);
      if (mapped) return mapped;
    }
  }

  const resolvedIds = await getMarketingServiceDetailPageIdsResolved();
  for (const id of resolvedIds) {
    if (pageIdFromMap != null && id === pageIdFromMap) continue;
    const row = await fetchCompanyPageById(id);
    if (!row) continue;
    const apiSlug = pickString(row.slug);
    if (!apiSlug || normalizeMarketingPathKey(apiSlug) !== normalized) continue;
    const mapped = mapRowToDetail(row);
    if (mapped) return mapped;
  }

  const lastSegment = slug.split('/').filter(Boolean).pop() || slug;
  if (slug.includes('/')) {
    return null;
  }

  return fakeGetMarketingServiceData(lastSegment);
});

/**
 * Gets all marketing service slugs (for static generation)
 *
 * @returns Promise<string[]>
 */
export async function getAllMarketingServiceSlugs(): Promise<string[]> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.marketingServices}`);
    // if (!response.ok) throw new Error('Failed to fetch marketing services');
    // const data = await response.json();
    // return data.map((service: MarketingServiceData) => service.slug);
    throw new Error('Real API not yet implemented');
  }

  return fakeGetAllMarketingServiceSlugs();
}

