import type { Metadata } from 'next';

import { getCanonicalUrl } from '@/config/site';

type ApiSeo = {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  canonical_url?: string | null;
  robots_index?: string | null;
  robots_follow?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: { url?: string | null } | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: { url?: string | null } | null;
};

type ApiPage = {
  slug: string;
  title: string;
  seo?: ApiSeo | null;
};

export function buildApiMetadata(page: ApiPage): Metadata {
  const seo = (page.seo || {}) as ApiSeo;

  const canonical = seo.canonical_url && /^https?:\/\//i.test(seo.canonical_url)
    ? seo.canonical_url
    : getCanonicalUrl(seo.canonical_url || `/${page.slug}/`);

  return {
    title: seo.title || page.title,
    description: seo.description || undefined,
    keywords: seo.keywords || undefined,
    robots: {
      index: seo.robots_index === 'index',
      follow: seo.robots_follow === 'follow',
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title: seo.og_title || seo.title || page.title,
      description: seo.og_description || seo.description || undefined,
      url: canonical,
      type: 'website',
      images: seo.og_image?.url ? [seo.og_image.url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitter_title || seo.title || page.title,
      description: seo.twitter_description || seo.description || undefined,
      images: seo.twitter_image?.url ? [seo.twitter_image.url] : undefined,
    },
  };
}

