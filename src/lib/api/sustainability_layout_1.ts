import type { DynamicPageData } from '@/fake-api/dynamic-pages';
import { formatBoldText } from '@/lib/htmlText';

type Sustainability1ApiResponse = {
  data?: {
    slug: string;
    title: string;
    content?: string;
    is_active?: boolean;
    layout?: string;
    meta?: {
      breadcrumb_image?: { url?: string };
      hero_title?: string;
      hero_items?: {
        image?: Array<{ url?: string }>;
        description?: string[];
      };
      sustainable_packaging_vision_title?: string;
      why_carton_title?: string;
      why_carton_description?: string;
      why_carton_items?: string;
      lamipak_commitment_title?: string;
      lamipak_commitment_image?: string;
      impact_statistics_description?: string;
      impact_statistics_items?: string;
      impact_statistics_footer_description?: string;
      recycling_journey_description?: string;
      recycling_journey_image?: string;
    };
    seo?: Record<string, unknown>;
  };
};

function stripHtml(value?: string | null): string {
  if (!value) return '';
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildPageApiPath(slug: string) {
  return slug
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function safeJsonParse<T>(value: string | undefined): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function fetchSustainabilityLayout1Page(slug: string): Promise<{
  slug: string;
  title: string;
  seo: Record<string, unknown>;
  pageData: DynamicPageData;
} | null> {
  const baseUrl = process.env.COMPANY_API_BASE_URL;
  if (!baseUrl) return null;

  try {
    const apiSlugPath = buildPageApiPath(slug);
    const res = await fetch(`${baseUrl}/v1/page/${apiSlugPath}`, { cache: 'no-store' });
    if (!res.ok) return null;

    const { data } = (await res.json()) as Sustainability1ApiResponse;
    if (!data || data.layout !== 'sustainability_1' || data.is_active === false) return null;

    const meta = data.meta || {};
    const seo = (data.seo || {}) as Record<string, unknown>;

    const heroImages = meta.hero_items?.image || [];
    const heroDescriptions = meta.hero_items?.description || [];

    const sustainabilityFootprintSection = {
      type: 'sustainability_footprint' as const,
      heading: 'Our',
      headingHighlight: 'Sustainability',
      headingSuffix: 'Footprint',
      items: heroImages
        .map((img, idx) => {
          const imageUrl = img?.url;
          if (!imageUrl) return null;
          return {
            id: `pick-footprint-${idx + 1}`,
            image: imageUrl,
            imageAlt: data.title,
            title: '',
            description: formatBoldText(stripHtml(heroDescriptions[idx] || '')),
          };
        })
        .filter(Boolean) as Array<{
        id: string;
        image: string;
        imageAlt: string;
        title: string;
        description: string;
      }>,
    };

    const imageQuoteBannerSection = meta.sustainable_packaging_vision_title
      ? {
          type: 'image_quote_banner' as const,
          backgroundImage: meta.breadcrumb_image?.url || '/pick_cartoon_cta_1.webp',
          backgroundAlt: 'Nature background',
          text: formatBoldText(meta.sustainable_packaging_vision_title),
        }
      : null;

    const whyCartonParsed = safeJsonParse<{
      title?: string[];
      description?: string[];
    }>(meta.why_carton_items);
    const whyTitles = whyCartonParsed?.title || [];
    const whyDescriptions = whyCartonParsed?.description || [];

    const whyCartonsMatterSection = {
      type: 'why_cartons_matter' as const,
      heading: formatBoldText(meta.why_carton_title || 'Why Cartons'),
      headingHighlight: 'Matter',
      description: formatBoldText(stripHtml(meta.why_carton_description || '')),
      items: whyTitles
        .map((t, idx) => ({
          id: `why-carton-${idx}`,
          title: formatBoldText(t),
          description: formatBoldText(whyDescriptions[idx] || ''),
          image: `/why_cartoon_${idx + 1}.webp`,
          imageAlt: t,
        }))
        .filter((i) => Boolean(i.title || i.description)),
    };

    const impactParsed = safeJsonParse<{
      title?: string[];
      description?: string[];
    }>(meta.impact_statistics_items);
    const impactTitles = impactParsed?.title || [];
    const impactDescriptions = impactParsed?.description || [];

    const impactProductBannerSection = meta.lamipak_commitment_title
      ? {
          type: 'impact_product_banner' as const,
          backgroundImage: '/pick_cartoon_cta_2.webp',
          backgroundAlt: 'Green field background',
          productImage: '/banner-slider2.jpg',
          productAlt: 'Carton packs',
          headingLines: meta.lamipak_commitment_title
            .split(/\r?\n/)
            .map((l) => formatBoldText(l.trim()))
            .filter(Boolean),
        }
      : null;

    const powerOfCartonSection = {
      type: 'power_of_carton_packaging' as const,
      heading: 'The Power Of',
      headingHighlight: 'Carton',
      headingSuffix: 'Packaging',
      introBold: 'Sustainability By The Numbers.',
      introText: formatBoldText(stripHtml(meta.impact_statistics_description || '')),
      cards: impactTitles
        .map((t, idx) => ({
          id: `impact-stat-${idx}`,
          valueHighlight: '',
          valueRest: '',
          title: formatBoldText(t),
          description: formatBoldText(impactDescriptions[idx] || ''),
        }))
        .filter((c) => Boolean(c.title || c.description)),
      footnote: formatBoldText(stripHtml(meta.impact_statistics_footer_description || '')),
    };

    const journeyRecyclingSection = meta.recycling_journey_description
      ? {
          type: 'journey_recycling_section' as const,
          heading: 'Building A Circular Packaging Future',
          image: '/journey_image.jpg',
          imageAlt: 'The recycling journey',
          description: formatBoldText(stripHtml(meta.recycling_journey_description)),
          ctaText: 'Join The Movement Pick Carton. Save Nature.',
          ctaLink: '/contact',
        }
      : null;

    const sections = [
      sustainabilityFootprintSection,
      imageQuoteBannerSection,
      whyCartonsMatterSection,
      impactProductBannerSection,
      powerOfCartonSection,
      journeyRecyclingSection,
    ].filter(Boolean) as DynamicPageData['sections'];

    const pageData: DynamicPageData = {
      slug: data.slug,
      type: 'pick-carton',
      title: data.title,
      content: formatBoldText(stripHtml(data.content)),
      heroBackgroundImage: meta.breadcrumb_image?.url || '/pick_cartoon_banner.webp',
      sections,
    };

    return {
      slug: data.slug,
      title: data.title,
      seo,
      pageData,
    };
  } catch {
    return null;
  }
}

