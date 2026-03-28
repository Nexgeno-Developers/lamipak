import type { Metadata } from 'next';
import type { MarketingServiceData } from '@/fake-api/marketing-services';
import { resolveSeoCanonicalUrl, SITE_CONFIG } from '@/config/site';

/**
 * Metadata for marketing service detail pages (CMS or fake).
 * `pathForCanonical` should match the current URL path (e.g. `/marketing-support-service/market-intelligence`).
 */
export function generateMarketingServiceDetailMetadata(
  serviceData: MarketingServiceData,
  pathForCanonical: string,
): Metadata {
  const path = pathForCanonical.startsWith('/') ? pathForCanonical : `/${pathForCanonical}`;
  const cms = serviceData.cmsSeo;

  if (cms) {
    const rawTitle = cms.title?.trim();
    const documentTitle = rawTitle || serviceData.seo.meta_title;
    const description =
      cms.description?.trim() || serviceData.seo.meta_description;
    const canonical = resolveSeoCanonicalUrl(cms.canonicalUrl ?? null, path);

    const keywordsRaw = cms.keywords?.trim();

    const robots =
      cms.robotsIndex || cms.robotsFollow
        ? {
            index: cms.robotsIndex?.toLowerCase() !== 'noindex',
            follow: cms.robotsFollow?.toLowerCase() !== 'nofollow',
          }
        : undefined;

    const ogTitle = cms.ogTitle?.trim() || rawTitle || serviceData.seo.meta_title;
    const ogDesc = cms.ogDescription?.trim() || description;
    const twTitle = cms.twitterTitle?.trim() || ogTitle;
    const twDesc = cms.twitterDescription?.trim() || ogDesc;
    const ogImage = cms.ogImageUrl?.trim();
    const twImage = cms.twitterImageUrl?.trim() || ogImage;

    return {
      title: { absolute: documentTitle },
      description,
      ...(keywordsRaw ? { keywords: keywordsRaw } : {}),
      ...(robots ? { robots } : {}),
      alternates: { canonical },
      openGraph: {
        title: ogTitle,
        description: ogDesc,
        url: canonical,
        type: 'website',
        ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      },
      twitter: {
        card: twImage ? 'summary_large_image' : 'summary',
        title: twTitle,
        description: twDesc,
        ...(twImage ? { images: [twImage] } : {}),
      },
    };
  }

  const canonicalUrl = resolveSeoCanonicalUrl(serviceData.seo.canonical_url ?? null, path);

  return {
    title: { absolute: serviceData.seo.meta_title || `Marketing Service | ${SITE_CONFIG.name}` },
    description: serviceData.seo.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: serviceData.seo.meta_title,
      description: serviceData.seo.meta_description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}
