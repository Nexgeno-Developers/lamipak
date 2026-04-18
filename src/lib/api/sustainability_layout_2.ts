import { formatBoldText } from '@/lib/htmlText';
import { fetchJsonCached } from '@/lib/api/apiCache';
import { getYouTubeEmbedUrl, getYouTubeVideoId } from '@/lib/youtubeEmbed';

type LamiraMeetSectionData = {
  titlePrefix?: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  storyTitle: string;
  paragraphs: string[];
  bodyHtml?: string;
  image: string;
  imageAlt: string;
}; 

export type LamiraSpecialAbilitiesSectionData = {
  heading: string;
  headingSuffix: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  videoUrl: string;
  videoPosterUrl?: string;
  layoutVariant?: 'three-column-html';
  card1Html?: string;
  card3Html?: string;
  abilities: Array<{ id: string; title: string; description: string }>;
};

type LamiraLovesSectionData = {
  heading: string;
  subtitle: string;
  items: Array<{ id: string; title: string; description: string; image: string; imageAlt: string }>;
};

type LamiraSharedGuideSectionData = {
  image: string;
  imageAlt: string;
  heading: string;
  description: string;
};

type LamiraSocialWorldMomentsSectionData = {
  heading: string;
  items: Array<{ id: string; image: string; imageAlt: string }>;
};

type Sustainability2ApiResponse = {
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
      hero_image?: { id?: number; filename?: string; url?: string };
      hero_description?: string;
      special_ability_title?: string;
      special_ability_description?: string;
      special_ability_items?: string | object;
      special_ability_card_1_description?: string;
      special_ability_card_2_video_url?: string;
      special_ability_card_3_description?: string;
      lamira_love_title?: string;
      lamira_love_description?: string;
      lamira_love_items?: string | object;
      lamira_love_images?: Array<{ id?: number; filename?: string; url?: string }>;
      shared_guide_title?: string;
      shared_guide_image?: { id?: number; filename?: string; url?: string };
      shared_guide_description?: string;
      social_world_title?: string;
      social_world_images?: Array<{ id?: number; filename?: string; url?: string }>;
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

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
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
    ? formatBoldText(decodeHtmlEntities(strongMatch[1].replace(/<[^>]+>/g, ' ').trim()))
    : '';

  const heroWithoutStrong = strongMatch
    ? heroDescriptionHtml.replace(strongRegex, '')
    : heroDescriptionHtml;

  if (hasHeadingTags) {
    const firstPRe = /<p\b[^>]*>([\s\S]*?)<\/p>/i;
    const firstPMatch = firstPRe.exec(heroWithoutStrong);
    const subtitle = firstPMatch ? stripHtml(firstPMatch[1]) : '';
    const bodyHtml = firstPMatch
      ? heroWithoutStrong.replace(firstPMatch[0], '').trim()
      : heroWithoutStrong.trim();

    return {
      subtitle: decodeHtmlEntities(subtitle),
      storyTitle: storyTitleClean ? `*${storyTitleClean}*` : '',
      paragraphs: [],
      bodyHtml,
    };
  }

  const bodyText = htmlToTextPreservingBreaks(heroWithoutStrong);
  const bodyParagraphs = splitParagraphsFromText(bodyText).map((p) => decodeHtmlEntities(p));

  const subtitle = bodyParagraphs.length >= 2 ? bodyParagraphs[0] : '';
  const paragraphs = bodyParagraphs.length >= 2 ? bodyParagraphs.slice(1) : bodyParagraphs;

  return {
    subtitle,
    storyTitle: storyTitleClean ? `*${storyTitleClean}*` : '',
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

function resolveImageUrl(
  entry: { id?: number; filename?: string; url?: string } | string | number | undefined,
  imageMap: Map<string | number, string>,
): string | undefined {
  if (!entry) return undefined;
  if (typeof entry === 'string' && entry.startsWith('http')) return entry;
  if (typeof entry === 'object' && 'url' in entry) return entry.url;
  if (typeof entry === 'string' || typeof entry === 'number') {
    return imageMap.get(entry);
  }
  return undefined;
}

function buildImageMap(
  images: Array<{ id?: number; filename?: string; url?: string } | undefined>,
): Map<string | number, string> {
  const map = new Map<string | number, string>();
  for (const img of images) {
    if (img && img.id && img.url) {
      map.set(img.id, img.url);
    }
  }
  return map;
}

function parseJsonOrObject<T>(value: string | object | undefined): T | null {
  if (!value) return null;
  if (typeof value === 'string') return safeJsonParse<T>(value);
  if (typeof value === 'object') return value as T;
  return null;
}

export type LamiraPageData = {
  title: string;
  heroBackgroundImage?: string;
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
    const payload = await fetchJsonCached<Sustainability2ApiResponse>(
      `${baseUrl}/v1/page/${apiSlugPath}`,
      { tags: [`page:${apiSlugPath}`] },
    );
    const data = payload?.data;
    if (!data || data.layout !== 'sustainability_2' || data.is_active === false) return null;

    const meta = data.meta || {};
    const seo = (data.seo || {}) as Record<string, unknown>;

    const heroTitle = meta.hero_title?.trim() || data.title;
    const heroImageUrl = meta.hero_image?.url;
    const heroBackgroundImage = meta.breadcrumb_image?.url;

    const imageMap = buildImageMap([
      meta.hero_image,
      meta.breadcrumb_image,
      meta.shared_guide_image,
      meta.short_summary_image,
      ...(meta.social_world_images || []),
      ...(meta.lamira_love_images || []),
    ]);

    const heroDescriptionHtml = meta.hero_description || '';
    const { subtitle, storyTitle, paragraphs, bodyHtml } = extractStoryTitleAndMeetContent(heroDescriptionHtml);

    const meet: LamiraMeetSectionData | undefined = heroImageUrl
      ? {
          titlePrefix: undefined,
          titleHighlight: formatBoldText(heroTitle),
          titleSuffix: undefined,
          subtitle: formatBoldText(subtitle),
          storyTitle,
          paragraphs: paragraphs.length ? paragraphs.map((p) => formatBoldText(p)) : [formatBoldText(stripHtml(data.content))],
          bodyHtml,
          image: heroImageUrl,
          imageAlt: heroTitle,
        }
      : undefined;

    const specialParsed = parseJsonOrObject<{
      itration?: string[];
      title?: string[];
      video_url?: string[];
      description?: string[];
    }>(meta.special_ability_items);
    const specialTitles = specialParsed?.title || [];
    const specialDescriptions = specialParsed?.description || [];
    const specialVideos = specialParsed?.video_url || [];
    const rawVideoUrl = specialVideos[0]?.trim();
    const legacyVideoEmbed =
      (rawVideoUrl && getYouTubeEmbedUrl(rawVideoUrl)) || rawVideoUrl || '';

    const card1Html = meta.special_ability_card_1_description?.trim();
    const card3Html = meta.special_ability_card_3_description?.trim();
    const card2WatchUrl = meta.special_ability_card_2_video_url?.trim();
    const card2Embed = card2WatchUrl ? getYouTubeEmbedUrl(card2WatchUrl) || '' : '';
    const card2YtId = card2WatchUrl ? getYouTubeVideoId(card2WatchUrl) : null;
    const card2Poster = card2YtId ? `https://img.youtube.com/vi/${card2YtId}/hqdefault.jpg` : undefined;

    const hasThreeColumnSpecial = Boolean(card1Html || card3Html || card2WatchUrl);
    const specialSectionHeading =
      meta.special_ability_title?.trim() || heroTitle || "Lamira's Special Abilities";

    const threeColumnSpecial: LamiraSpecialAbilitiesSectionData | undefined = hasThreeColumnSpecial
      ? {
          heading: formatBoldText(specialSectionHeading),
          headingSuffix: '',
          subtitle: formatBoldText(meta.special_ability_description?.trim() || ''),
          image: heroImageUrl || '',
          imageAlt: meta.special_ability_title?.trim() || specialSectionHeading,
          videoUrl: card2Embed,
          videoPosterUrl: card2Poster || heroImageUrl || '',
          layoutVariant: 'three-column-html',
          card1Html: card1Html || '',
          card3Html: card3Html || '',
          abilities: [],
        }
      : undefined;

    const hasLegacySpecial =
      Boolean(meta.special_ability_title?.trim()) && specialTitles.length > 0 && !hasThreeColumnSpecial;

    const legacySpecial: LamiraSpecialAbilitiesSectionData | undefined = hasLegacySpecial
      ? {
          heading: formatBoldText(meta.special_ability_title || ''),
          headingSuffix: '',
          subtitle: formatBoldText(meta.special_ability_description?.trim() || ''),
          image: heroImageUrl || '',
          imageAlt: meta.special_ability_title || '',
          videoUrl: legacyVideoEmbed,
          abilities: specialTitles
            .map((t, idx) => ({
              id: `ability-${idx}`,
              title: formatBoldText(t),
              description: formatBoldText(specialDescriptions[idx] || ''),
            }))
            .filter((a) => Boolean(a.title || a.description)),
        }
      : undefined;

    const special = threeColumnSpecial ?? legacySpecial;

    const loveParsed = parseJsonOrObject<{
      itration?: string[];
      title?: string[];
      image?: Array<string | number | { id?: number; url?: string }>;
      description?: string[];
    }>(meta.lamira_love_items);
    const loveTitles = loveParsed?.title || [];
    const loveDescriptions = loveParsed?.description || [];
    const loveImageEntries = loveParsed?.image || [];

    const loveItems: Array<{ id: string; title: string; description: string; image: string; imageAlt: string }> = [];
    for (let idx = 0; idx < loveTitles.length; idx++) {
      const t = loveTitles[idx];
      const imageUrl = resolveImageUrl(loveImageEntries[idx], imageMap);
      if (!imageUrl && !t) continue;
      loveItems.push({
        id: `love-${idx}`,
        title: formatBoldText(t),
        description: formatBoldText(loveDescriptions[idx] || ''),
        image: imageUrl || '',
        imageAlt: t,
      });
    }

    const loves: LamiraLovesSectionData | undefined =
      meta.lamira_love_title && loveItems.length
        ? {
            heading: formatBoldText(meta.lamira_love_title),
            subtitle: formatBoldText(meta.lamira_love_description?.trim() || ''),
            items: loveItems.filter((item) => Boolean(item.title || item.description)),
          }
        : undefined;

    const sharedImageUrl = meta.shared_guide_image?.url;
    const shared: LamiraSharedGuideSectionData | undefined =
      meta.shared_guide_title && sharedImageUrl
        ? {
            image: sharedImageUrl,
            imageAlt: meta.shared_guide_title,
            heading: formatBoldText(meta.shared_guide_title),
            description: formatBoldText(meta.shared_guide_description?.trim() || ''),
          }
        : undefined;

    const socialImageEntries = meta.social_world_images || [];
    const socialItems: Array<{ id: string; image: string; imageAlt: string }> = [];
    for (let idx = 0; idx < socialImageEntries.length; idx++) {
      const entry = socialImageEntries[idx];
      const imageUrl = resolveImageUrl(entry, imageMap);
      if (!imageUrl) continue;
      socialItems.push({
        id: `moment-${idx + 1}`,
        image: imageUrl,
        imageAlt: entry.filename || `Social moment image ${idx + 1}`,
      });
    }

    const social: LamiraSocialWorldMomentsSectionData | undefined =
      meta.social_world_title && socialItems.length
        ? {
            heading: formatBoldText(meta.social_world_title),
            items: socialItems,
          }
        : undefined;

    const pageData: LamiraPageData = {
      title: data.title,
      heroBackgroundImage,
      lamiraMeetSection: meet,
      lamiraSpecialAbilitiesSection: special,
      lamiraLovesSection: loves,
      lamiraSharedGuideSection: shared,
      lamiraSocialWorldMomentsSection: social,
    };

    return { slug: data.slug, title: data.title, seo, pageData };
  } catch {
    return null;
  }
}
