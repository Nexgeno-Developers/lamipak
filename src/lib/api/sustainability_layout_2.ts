import type { LamiraMeetSectionData } from '@/components/components/LamiraMeetSection';
import type { LamiraSpecialAbilitiesSectionData } from '@/components/components/LamiraSpecialAbilitiesSection';
import type { LamiraLovesSectionData } from '@/components/components/LamiraLovesSection';
import type { LamiraSharedGuideSectionData } from '@/components/components/LamiraSharedGuideSection';
import type { LamiraSocialWorldMomentsSectionData } from '@/components/components/LamiraSocialWorldMomentsSection';
import { getYouTubeEmbedUrl } from '@/lib/youtubeEmbed';

type Sustainability2ApiResponse = {
  data?: {
    slug: string;
    title: string;
    content?: string;
    is_active?: boolean;
    layout?: string;
    meta?: {
      hero_title?: string;
      hero_image?: { url?: string };
      hero_description?: string;
      breadcrumb_image?: { url?: string };

      special_ability_title?: string;
      special_ability_description?: string;
      special_ability_items?: string;

      lamira_love_title?: string;
      lamira_love_description?: string;
      lamira_love_items?: string;

      shared_guide_title?: string;
      shared_guide_image?: string;
      shared_guide_description?: string;

      social_world_title?: string;
      social_world_images?: string;
    };
    seo?: Record<string, unknown>;
  };
};

function stripHtml(value?: string | null): string {
  if (!value) return '';
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, '’')
    .replace(/&lsquo;/g, '‘')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function htmlToTextPreservingBreaks(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      .replace(/\r\n/g, '\n'),
  )
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function splitParagraphsFromText(text: string): string[] {
  return (
    text
      .split(/\n\s*\n/g)
      .map((p) => p.trim())
      .filter(Boolean) || []
  );
}

function extractStoryTitleAndMeetContent(heroDescriptionHtml: string): {
  subtitle: string;
  storyTitle: string;
  paragraphs: string[];
  bodyHtml?: string;
} {
  const hasHeadingTags = /<h[3-6]\b/i.test(heroDescriptionHtml);

  const strongRegex = /<strong[^>]*>([\s\S]*?)<\/strong>/i;
  const strongMatch = strongRegex.exec(heroDescriptionHtml);

  const storyTitleClean = strongMatch
    ? decodeHtmlEntities(strongMatch[1].replace(/<[^>]+>/g, ' ').trim())
    : '';

  const heroWithoutStrong = strongMatch
    ? heroDescriptionHtml.replace(strongRegex, '')
    : heroDescriptionHtml;

  // If the editor provided headings (<h3>/<h4>...), preserve the HTML
  // so the frontend can render those tags exactly.
  if (hasHeadingTags) {
    // Extract first <p> as subtitle if present, and remove it from bodyHtml.
    const firstPRe = /<p\b[^>]*>([\s\S]*?)<\/p>/i;
    const firstPMatch = firstPRe.exec(heroWithoutStrong);
    const subtitle = firstPMatch ? stripHtml(firstPMatch[1]) : '';
    const bodyHtml = firstPMatch
      ? heroWithoutStrong.replace(firstPMatch[0], '').trim()
      : heroWithoutStrong.trim();

    return {
      subtitle: decodeHtmlEntities(subtitle),
      storyTitle: '',
      paragraphs: [],
      bodyHtml,
    };
  }

  const bodyText = htmlToTextPreservingBreaks(heroWithoutStrong);
  const bodyParagraphs = splitParagraphsFromText(bodyText).map((p) => decodeHtmlEntities(p));

  // Convention used in the CMS copy:
  // first paragraph = subtitle (short hook), remaining = story paragraphs.
  const subtitle = bodyParagraphs.length >= 2 ? bodyParagraphs[0] : '';
  const paragraphs = bodyParagraphs.length >= 2 ? bodyParagraphs.slice(1) : bodyParagraphs;

  return {
    subtitle,
    storyTitle: storyTitleClean ? `*${storyTitleClean}*` : 'Lamira’s Story',
    paragraphs: paragraphs.length ? paragraphs : [stripHtml(heroDescriptionHtml)],
    bodyHtml: undefined,
  };
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

function splitLines(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

function splitToParagraphs(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function pickPrefixHighlight(title: string): { prefix?: string; highlight: string; suffix?: string } {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 1) return { highlight: title.trim() };
  if (parts.length === 2) return { prefix: parts[0], highlight: parts[1] };
  return { prefix: parts[0], highlight: parts.slice(1).join(' ') };
}

const LOVE_IMAGE_FALLBACKS = ['/what_lamira_1.webp', '/what_lamira_2.webp', '/what_lamira_1.webp'];
const SHARED_GUIDE_IMAGE_FALLBACK = '/share_left_1.webp';
const SOCIAL_IMAGE_FALLBACKS = [
  '/moments_21.webp',
  '/moments_22.webp',
  '/moments_23.webp',
  '/moments_24.webp',
  '/moments_25.webp',
  '/moments_26.webp',
];

export type LamiraPageData = {
  title: string;
  heroBackgroundImage: string;
  lamiraMeetSection?: LamiraMeetSectionData;
  lamiraSpecialAbilitiesSection?: LamiraSpecialAbilitiesSectionData;
  lamiraLovesSection?: LamiraLovesSectionData;
  lamiraSharedGuideSection?: LamiraSharedGuideSectionData;
  lamiraSocialWorldMomentsSection?: LamiraSocialWorldMomentsSectionData;
};

export async function fetchSustainabilityLayout2Page(slug: string): Promise<{
  slug: string;
  title: string;
  seo: Record<string, unknown>;
  pageData: LamiraPageData;
} | null> {
  const baseUrl = process.env.COMPANY_API_BASE_URL;
  if (!baseUrl) return null;

  try {
    const apiSlugPath = buildPageApiPath(slug);
    const res = await fetch(`${baseUrl}/v1/page/${apiSlugPath}`, { cache: 'no-store' });
    if (!res.ok) return null;

    const { data } = (await res.json()) as Sustainability2ApiResponse;
    if (!data || data.layout !== 'sustainability_2' || data.is_active === false) return null;

    const meta = data.meta || {};
    const seo = (data.seo || {}) as Record<string, unknown>;

    const heroTitle = meta.hero_title?.trim() || data.title;
    const heroImage = meta.hero_image?.url || '/lamira_right_image.webp';
    const heroBackgroundImage = meta.breadcrumb_image?.url || '/pick_cartoon_banner.webp';

    const heroDescriptionHtml = meta.hero_description || '';
    const { subtitle, storyTitle, paragraphs, bodyHtml } = extractStoryTitleAndMeetContent(heroDescriptionHtml);

    const meet: LamiraMeetSectionData = {
      titlePrefix: undefined,
      titleHighlight: heroTitle,
      titleSuffix: undefined,
      subtitle,
      storyTitle,
      paragraphs: paragraphs.length ? paragraphs : [stripHtml(data.content)],
      bodyHtml,
      image: heroImage,
      imageAlt: heroTitle,
    };

    const specialParsed = safeJsonParse<{
      title?: string[];
      video_url?: string[];
      description?: string[];
    }>(meta.special_ability_items);
    const specialTitles = specialParsed?.title || [];
    const specialDescriptions = specialParsed?.description || [];
    const specialVideos = specialParsed?.video_url || [];
    const rawVideoUrl = specialVideos[0]?.trim();
    const specialVideoUrl =
      (rawVideoUrl && getYouTubeEmbedUrl(rawVideoUrl)) ||
      rawVideoUrl ||
      'https://www.youtube.com/watch?v=ScMzIvxBSi4';

    const specialTitle = meta.special_ability_title?.trim() || "Lamira's Special Abilities";
    const { prefix: specialPrefix, highlight: specialHighlight, suffix: specialSuffix } =
      pickPrefixHighlight(specialTitle);

    const special: LamiraSpecialAbilitiesSectionData = {
      headingHighlight: specialPrefix ? `${specialPrefix}` : specialHighlight,
      headingSuffix: specialPrefix ? specialHighlight : specialSuffix || '',
      subtitle: meta.special_ability_description?.trim() || '',
      image: heroImage,
      imageAlt: specialTitle,
      videoUrl: specialVideoUrl,
      abilities: specialTitles
        .map((t, idx) => ({
          id: `ability-${idx}`,
          title: t,
          description: specialDescriptions[idx] || '',
        }))
        .filter((a) => Boolean(a.title || a.description)),
    };

    const loveParsed = safeJsonParse<{
      title?: string[];
      description?: string[];
      image?: string[];
    }>(meta.lamira_love_items);
    const loveTitles = loveParsed?.title || [];
    const loveDescriptions = loveParsed?.description || [];
    const loveImages = loveParsed?.image || [];

    const loveTitle = meta.lamira_love_title?.trim() || 'What Lamira Loves';
    const loveHeading = pickPrefixHighlight(loveTitle);

    const loves: LamiraLovesSectionData = {
      headingPrefix: loveHeading.prefix,
      headingHighlight: loveHeading.highlight,
      headingSuffix: loveHeading.suffix,
      subtitle: meta.lamira_love_description?.trim() || '',
      items: loveTitles
        .map((t, idx) => ({
          id: `love-${idx}`,
          title: t,
          description: loveDescriptions[idx] || '',
          image: LOVE_IMAGE_FALLBACKS[idx % LOVE_IMAGE_FALLBACKS.length],
          imageAlt: t,
        }))
        .filter((i) => Boolean(i.title || i.description)),
    };

    const sharedTitle = meta.shared_guide_title?.trim() || 'A Shared Guide For The Future';
    const sharedHeading = pickPrefixHighlight(sharedTitle);
    const shared: LamiraSharedGuideSectionData = {
      image: SHARED_GUIDE_IMAGE_FALLBACK,
      imageAlt: sharedTitle,
      headingPrefix: sharedHeading.prefix,
      headingHighlight: sharedHeading.highlight,
      headingSuffix: sharedHeading.suffix,
      description: meta.shared_guide_description?.trim() || '',
    };

    const socialTitle = meta.social_world_title?.trim() || 'Moments From Our Social World';
    const socialHeading = pickPrefixHighlight(socialTitle);
    const socialIds = (meta.social_world_images || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
    const socialItems = (socialIds.length ? socialIds : SOCIAL_IMAGE_FALLBACKS).map(
      (_, idx): LamiraSocialWorldMomentsSectionData['items'][number] => ({
        id: `moment-${idx + 1}`,
        image: SOCIAL_IMAGE_FALLBACKS[idx % SOCIAL_IMAGE_FALLBACKS.length],
        imageAlt: `Social moment image ${idx + 1}`,
      }),
    );
    const social: LamiraSocialWorldMomentsSectionData = {
      headingPrefix: socialHeading.prefix || 'Moments From Our',
      headingHighlight: socialHeading.highlight,
      headingSuffix: socialHeading.suffix,
      items: socialItems,
    };

    const pageData: LamiraPageData = {
      title: data.title,
      heroBackgroundImage,
      lamiraMeetSection: meet,
      lamiraSpecialAbilitiesSection: special.abilities.length ? special : undefined,
      lamiraLovesSection: loves.items.length ? loves : undefined,
      lamiraSharedGuideSection: shared.description ? shared : undefined,
      lamiraSocialWorldMomentsSection: social.items.length ? social : undefined,
    };

    return { slug: data.slug, title: data.title, seo, pageData };
  } catch {
    return null;
  }
}

