import { formatBoldText } from '@/lib/htmlText';
import { fetchJsonCached } from '@/lib/api/apiCache';

export type NgoMembershipMapSectionData = {
  heading: string;
  mapImage?: string;
  mapImageAlt?: string;
  accentColor?: string;
  leaderLineColor?: string;
  dotColor?: string;
  sectionBackgroundColor?: string;
};

export type NgoAllianceCardsSectionData = {
  heading: string;
  accentColor?: string;
  cards: Array<{
    id: string;
    html: string;
  }>;
};

export type NgoCircularFutureSectionData = {
  heroHeading: string;
  heroIntro: string;
  featureHeading: string;
  featureBody: string;
  image: string;
  imageAlt: string;
  accentColor?: string;
  backgroundColor?: string;
};

export type NgosPageData = {
  title: string;
  heroBackgroundImage?: string;
  breadcrumbDescription?: string;
  ngosMembershipMapSection?: NgoMembershipMapSectionData;
  ngosAllianceCardsSection?: NgoAllianceCardsSectionData;
  ngosCircularFutureSection?: NgoCircularFutureSectionData;
};

type Sustainability5ApiResponse = {
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
      breadcrumb_description?: string;
      membership_title?: string;
      membership_map?: { id?: number; filename?: string; url?: string };
      membership_block_1?: string;
      membership_block_2?: string;
      membership_block_3?: string;
      circular_future_title?: string;
      circular_future_description?: string;
      community_title?: string;
      community_image?: { id?: number; filename?: string; url?: string };
      community_description?: string;
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

export async function fetchSustainabilityLayout5Page(slug: string): Promise<{
  slug: string;
  title: string;
  seo: Record<string, unknown>;
  pageData: NgosPageData;
} | null> {
  const baseUrl = process.env.COMPANY_API_BASE_URL;
  if (!baseUrl) return null;

  try {
    const apiSlugPath = buildPageApiPath(slug);
    const payload = await fetchJsonCached<Sustainability5ApiResponse>(
      `${baseUrl}/v1/page/${apiSlugPath}`,
      { tags: [`page:${apiSlugPath}`] },
    );
    const data = payload?.data;
    if (!data || data.layout !== 'sustainability_5' || data.is_active === false) return null;

    const meta = data.meta || {};
    const seo = (data.seo || {}) as Record<string, unknown>;

    const allianceCardBlocks = [
      meta.membership_block_1,
      meta.membership_block_2,
      meta.membership_block_3,
    ].filter(Boolean) as string[];

    const membershipMapSection: NgoMembershipMapSectionData | undefined = meta.membership_title
      ? {
          heading: formatBoldText(meta.membership_title),
          mapImage: meta.membership_map?.url,
          mapImageAlt: meta.membership_map?.filename?.replace(/[-_]+/g, ' ').trim() || meta.membership_title,
          accentColor: '#00AEEF',
        }
      : undefined;

    const allianceCardsSection: NgoAllianceCardsSectionData | undefined =
      allianceCardBlocks.length && meta.membership_title
        ? {
            heading: formatBoldText(meta.membership_title),
            accentColor: '#00AEEF',
            cards: allianceCardBlocks.map((html, idx) => ({
              id: `alliance-card-${idx}`,
              html,
            })),
          }
        : undefined;

    const circularFutureSection: NgoCircularFutureSectionData | undefined =
      (meta.circular_future_description || meta.community_description) && meta.circular_future_title
        ? {
            heroHeading: formatBoldText(meta.circular_future_title),
            heroIntro: formatBoldText(stripHtml(meta.circular_future_description)),
            featureHeading: formatBoldText(meta.community_title || ''),
            featureBody: formatBoldText(stripHtml(meta.community_description)),
            image: meta.community_image?.url || '',
            imageAlt: meta.community_title || meta.circular_future_title,
            accentColor: '#00AEEF',
          }
        : undefined;

    const pageData: NgosPageData = {
      title: data.title,
      heroBackgroundImage: meta.breadcrumb_image?.url,
      breadcrumbDescription: meta.breadcrumb_description,
      ngosMembershipMapSection: membershipMapSection,
      ngosAllianceCardsSection: allianceCardsSection,
      ngosCircularFutureSection: circularFutureSection,
    };

    return { slug: data.slug, title: data.title, seo, pageData };
  } catch {
    return null;
  }
}
