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
    href: string;
    imageUrl?: string;
    imageAlt?: string;
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

type MediaRef = { id?: number; filename?: string; url?: string };

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
      breadcrumb_image?: MediaRef;
      breadcrumb_description?: string;
      membership_title?: string;
      membership_map?: MediaRef;
      membership_block_1?: string;
      membership_block_1_icon?: MediaRef;
      membership_block_1_url?: string;
      membership_block_2?: string;
      membership_block_2_icon?: MediaRef;
      membership_block_2_url?: string;
      membership_block_3?: string;
      membership_block_3_icon?: MediaRef;
      membership_block_3_url?: string;
      circular_future_title?: string;
      circular_future_description?: string;
      community_title?: string;
      community_image?: MediaRef;
      community_description?: string;
    };
    seo?: Record<string, unknown>;
  };
};

function stripHtml(value?: string | null): string {
  if (!value) return '';
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizePageHref(url?: string | null): string {
  if (!url || !String(url).trim()) return '/';
  const raw = String(url).trim();
  try {
    const u = new URL(raw);
    if (
      u.hostname === 'localhost' ||
      u.hostname === '127.0.0.1' ||
      u.hostname.includes('lamipak') ||
      u.hostname.includes('vercel.app') ||
      u.hostname.includes('webtesting.pw')
    ) {
      const path = u.pathname || '/';
      return path + (u.search || '');
    }
    return raw;
  } catch {
    return raw.startsWith('/') ? raw : `/${raw.replace(/^\/+/, '')}`;
  }
}

function buildAllianceCardsFromMeta(
  meta: NonNullable<Sustainability5ApiResponse['data']>['meta'],
): NgoAllianceCardsSectionData['cards'] {
  if (!meta) return [];
  const out: NgoAllianceCardsSectionData['cards'] = [];

  for (let i = 1; i <= 3; i++) {
    const html = meta[`membership_block_${i}` as keyof typeof meta] as string | undefined;
    const icon = meta[`membership_block_${i}_icon` as keyof typeof meta] as MediaRef | undefined;
    const urlRaw = meta[`membership_block_${i}_url` as keyof typeof meta] as string | undefined;

    const hasHtml = Boolean(html?.trim());
    const imageUrl = icon?.url?.trim();
    if (!hasHtml && !imageUrl) continue;

    const imageAlt =
      icon?.filename?.replace(/[-_]+/g, ' ').trim() ||
      stripHtml(html).slice(0, 120) ||
      `Partner ${i}`;

    const card: NgoAllianceCardsSectionData['cards'][number] = {
      id: `alliance-card-${i}`,
      html: html?.trim() || '',
      href: normalizePageHref(urlRaw),
    };
    if (imageUrl) {
      card.imageUrl = imageUrl;
      card.imageAlt = imageAlt;
    }
    out.push(card);
  }

  return out;
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

    const membershipMapSection: NgoMembershipMapSectionData | undefined = meta.membership_title
      ? {
          heading: formatBoldText(meta.membership_title),
          mapImage: meta.membership_map?.url,
          mapImageAlt: meta.membership_map?.filename?.replace(/[-_]+/g, ' ').trim() || meta.membership_title,
          accentColor: '#00AEEF',
        }
      : undefined;

    const allianceCardList = buildAllianceCardsFromMeta(meta);
    const allianceCardsSection: NgoAllianceCardsSectionData | undefined =
      allianceCardList.length > 0
        ? {
            heading: meta.membership_title ? formatBoldText(meta.membership_title) : '',
            accentColor: '#00AEEF',
            cards: allianceCardList,
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
