import { decodeHtmlEntities, formatBoldText } from '@/lib/htmlText';
import { fetchJsonCached } from '@/lib/api/apiCache';

export type GreenSustainabilityVisionCardData = {
  id: string;
  title: string;
  iconImageUrl?: string;
  icon?: 'globe' | 'social' | 'product' | 'business';
  descriptionHtml?: string;
  bullets?: Array<{
    parts: Array<{ text: string; bold?: boolean }>;
  }>;
};

export type GreenSustainabilityVisionSectionData = {
  heading: string;
  subtitle: string;
  cards: GreenSustainabilityVisionCardData[];
  footerText: string;
};

export type GreenPhotovoltaicProjectSectionData = {
  htmlItems: string[];
};

export type GreenSustainabilityJourneySectionData = {
  heading: string;
  body: string;
  image: string;
  imageAlt: string;
  backgroundColor?: string;
  accentColor?: string;
};

export type GreenEffortsPageData = {
  title: string;
  heroBackgroundImage?: string;
  greenSustainabilityVisionSection?: GreenSustainabilityVisionSectionData;
  greenPhotovoltaicProjectSections?: GreenPhotovoltaicProjectSectionData[];
  greenSustainabilityJourneySection?: GreenSustainabilityJourneySectionData;
};

type Sustainability3ApiResponse = {
  data?: {
    id?: number;
    slug: string;
    language?: string;
    title: string;
    content?: string;
    is_active?: boolean;
    layout?: string;
    company_id?: number;
    meta?: {
      breadcrumb_image?: { id?: number; filename?: string; url?: string };
      hero_title?: string;
      hero_description_intro?: string;
      hero_items?: string | {
        itration?: string[];
        image?: Array<{ id?: number; filename?: string; url?: string } | string>;
        title?: string[];
        description?: string[];
      };
      hero_description_footer?: string;
      project_items?: string;
      sustainability_journey_title?: string;
      sustainability_journey_image?: { id?: number; filename?: string; url?: string };
      sustainability_journey_description?: string;
      short_summary_image?: { id?: number; filename?: string; url?: string };
      short_summary_description?: string;
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

function parseHeroItems(
  raw: NonNullable<NonNullable<Sustainability3ApiResponse['data']>['meta']>['hero_items'],
): {
  itration?: string[];
  image?: Array<{ id?: number; filename?: string; url?: string } | string>;
  title?: string[];
  description?: string[];
} | null {
  if (raw == null) return null;
  if (typeof raw === 'string') return safeJsonParse(raw);
  if (typeof raw === 'object') return raw as typeof raw;
  return null;
}

function heroImageUrl(entry: { id?: number; filename?: string; url?: string } | string | undefined): string | undefined {
  if (!entry) return undefined;
  if (typeof entry === 'string') return entry.trim() || undefined;
  return entry.url?.trim() || undefined;
}

function hasHtmlTags(s: string): boolean {
  return /<[^>]+>/.test(s);
}

const ICON_MAP = ['globe', 'social', 'product', 'business'] as const;

function parseHtmlDescriptionToBullets(
  html: string,
): Array<{ parts: Array<{ text: string; bold?: boolean }> }> {
  const decoded = decodeHtmlEntities(html);
  const paragraphs = decoded.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
  if (!paragraphs) {
    const cleaned = stripHtml(decoded);
    return cleaned ? [{ parts: [{ text: cleaned }] }] : [];
  }

  return paragraphs
    .map((p) => {
      const parts: Array<{ text: string; bold?: boolean }> = [];
      const tagContent = p.replace(/<\/?p[^>]*>/gi, '');
      const segments = tagContent.split(
        /(<strong[^>]*>[\s\S]*?<\/strong>|<b[^>]*>[\s\S]*?<\/b>)/gi,
      );

      for (const seg of segments) {
        if (!seg) continue;
        const strongMatch = /^<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/i.exec(seg);
        if (strongMatch) {
          const text = stripHtml(strongMatch[1]);
          if (text) parts.push({ text, bold: true });
        } else {
          const text = stripHtml(seg);
          if (text) parts.push({ text });
        }
      }

      if (parts.length === 0) return null;
      return { parts };
    })
    .filter(Boolean) as Array<{ parts: Array<{ text: string; bold?: boolean }> }>;
}

export async function fetchSustainabilityLayout3Page(slug: string): Promise<{
  slug: string;
  title: string;
  seo: Record<string, unknown>;
  pageData: GreenEffortsPageData;
} | null> {
  const baseUrl = process.env.COMPANY_API_BASE_URL;
  if (!baseUrl) return null;

  try {
    const apiSlugPath = buildPageApiPath(slug);
    const payload = await fetchJsonCached<Sustainability3ApiResponse>(
      `${baseUrl}/v1/page/${apiSlugPath}`,
      { tags: [`page:${apiSlugPath}`] },
    );
    const data = payload?.data;
    if (!data || data.layout !== 'sustainability_3' || data.is_active === false) return null;

    const meta = data.meta || {};
    const seo = (data.seo || {}) as Record<string, unknown>;

    const heroItems = parseHeroItems(meta.hero_items);
    const heroTitles = heroItems?.title || [];
    const heroDescriptions = heroItems?.description || [];
    const heroImages = heroItems?.image || [];

    const visionCards: GreenSustainabilityVisionCardData[] = [];
    for (let idx = 0; idx < heroTitles.length; idx++) {
      const rawTitle = (heroTitles[idx] || '').trim();
      if (!rawTitle) continue;

      const htmlDesc = (heroDescriptions[idx] || '').trim();
      if (!htmlDesc) continue;

      const iconImageUrl = heroImageUrl(heroImages[idx]);
      const icon = ICON_MAP[idx] ?? 'globe';
      const hasHtml = hasHtmlTags(htmlDesc);

      const bullets = hasHtml ? undefined : parseHtmlDescriptionToBullets(htmlDesc || rawTitle);
      const descriptionHtml = hasHtml ? htmlDesc : undefined;

      if (!descriptionHtml && !bullets?.length) continue;

      visionCards.push({
        id: `vision-card-${idx}`,
        title: formatBoldText(rawTitle.toUpperCase()),
        icon: icon as (typeof ICON_MAP)[number],
        iconImageUrl,
        descriptionHtml,
        bullets,
      });
    }

    const visionSection: GreenSustainabilityVisionSectionData | undefined = visionCards.length
      ? {
          heading: formatBoldText(meta.hero_title || data.title),
          subtitle: formatBoldText(meta.hero_description_intro || ''),
          cards: visionCards,
          footerText: formatBoldText(stripHtml(meta.hero_description_footer || '')),
        }
      : undefined;

    const parsedProjectItems = safeJsonParse<{ itration?: string[]; content?: string[] }>(meta.project_items);
    const projectHtmlItems = parsedProjectItems?.content?.filter(Boolean) || [];

    const photovoltaicSection: GreenPhotovoltaicProjectSectionData | undefined =
      projectHtmlItems.length ? { htmlItems: projectHtmlItems } : undefined;

    const journeyImageUrl = meta.sustainability_journey_image?.url;
    const journeyTitle = meta.sustainability_journey_title || data.title;

    const journeySection: GreenSustainabilityJourneySectionData | undefined =
      meta.sustainability_journey_description && journeyImageUrl
        ? {
            heading: formatBoldText(journeyTitle),
            body: formatBoldText(stripHtml(meta.sustainability_journey_description)),
            image: journeyImageUrl,
            imageAlt: journeyTitle,
            backgroundColor: '#f8f9fa',
            accentColor: '#00AEEF',
          }
        : undefined;

    const pageData: GreenEffortsPageData = {
      title: data.title,
      heroBackgroundImage: meta.breadcrumb_image?.url,
      greenSustainabilityVisionSection: visionSection,
      greenPhotovoltaicProjectSections: photovoltaicSection ? [photovoltaicSection] : undefined,
      greenSustainabilityJourneySection: journeySection,
    };

    return { slug: data.slug, title: data.title, seo, pageData };
  } catch {
    return null;
  }
}
