import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { getCanonicalUrl } from '@/config/site';

import LamiraPage from '@/components/LamiraPage';
import GreenEffortsPage from '@/components/GreenEffortsPage';
import CmsPage from '@/components/CmsPage';
import PickCartoonPage from '@/components/PickCartoonPage';
import CertificationsAchievementsPage from '@/components/CertificationsAchievementsPage';
import NgosPage from '@/components/NgosPage';
import CarbonNetZeroRoadmapPage from '@/components/CarbonNetZeroRoadmapPage';
import OurCompanyDynamicPage from '@/components/OurCompanyDynamicPage';
import ContactUsPage from '@/components/ContactUsPage';
import GovernanceManagementPage from '@/components/GovernanceManagementPage';

import {
  getDynamicPageBySlug,
  type DynamicPageData,
} from '@/fake-api/dynamic-pages';
import {
  fetchMarketingServiceData,
  fetchMarketingServicesOverviewData,
  getMarketingServicesListingPath,
  shouldTryFetchMarketingServiceDetail,
} from '@/lib/api';
import MarketingServicesListingPage, {
  generateMarketingServicesListingMetadata,
} from '@/components/marketing/MarketingServicesListingPage';
import MarketingServiceDetailView from '@/components/marketing/MarketingServiceDetailView';
import { generateMarketingServiceDetailMetadata } from '@/components/marketing/generateMarketingServiceDetailMetadata';

interface PageProps {
  params: Promise<{
    slug: string[]; // ✅ FIXED (array for nested routes)
  }>;
}

const componentMap: Record<string, ComponentType<{ data: DynamicPageData }>> = {
  lamira1: LamiraPage,
  green: GreenEffortsPage,
  certifications: CertificationsAchievementsPage,
  ngos: NgosPage,
  'our-company': OurCompanyDynamicPage,
  'our-factory': OurCompanyDynamicPage,
  'carbon-roadmap': CarbonNetZeroRoadmapPage,
  'pick-carton': PickCartoonPage,
  'contact-us': ContactUsPage,
  'governance-management': GovernanceManagementPage,
};

async function fetchPageData(fullSlug: string) {
  return getDynamicPageBySlug(fullSlug); // ✅ now accepts full slug
}

/* ================== SEO ================== */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = slug?.join('/') || ''; // ✅ MAIN FIX

  const listingPath = await getMarketingServicesListingPath();
  if (listingPath === `/${fullSlug}`) {
    return generateMarketingServicesListingMetadata();
  }

  if (await shouldTryFetchMarketingServiceDetail(fullSlug)) {
    const serviceData = await fetchMarketingServiceData(fullSlug);
    if (serviceData) {
      const pathForCanonical = serviceData.cmsDetailPath ?? `/${fullSlug}`;
      return generateMarketingServiceDetailMetadata(serviceData, pathForCanonical);
    }
  }

  const data = await fetchPageData(fullSlug);

  if (!data) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  const seo = data.seo;

  const canonicalPath = seo?.canonical_path || `/${fullSlug}`;
  const canonicalUrl = getCanonicalUrl(canonicalPath);

  const title = seo?.meta_title || data.title;
  const description =
    seo?.meta_description || data.content?.toString().slice(0, 150) || undefined;

  return {
    title,
    description,
    keywords: seo?.keywords,
    authors: seo?.author ? [{ name: seo.author }] : undefined,
    robots: seo?.robots,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo?.og_title || title,
      description: seo?.og_description || description,
      url: canonicalUrl,
      type: seo?.og_type || 'website',
      images: seo?.og_image ? [seo.og_image] : undefined,
    },
    twitter: {
      card: seo?.twitter_card || 'summary_large_image',
      title: seo?.twitter_title || title,
      description: seo?.twitter_description || description,
      images: seo?.twitter_image ? [seo.twitter_image] : undefined,
    },
  };
}

/* ================== PAGE ================== */
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const fullSlug = slug?.join('/') || ''; // ✅ MAIN FIX

  const listingPathCheck = await getMarketingServicesListingPath();
  if (listingPathCheck === `/${fullSlug}`) {
    return <MarketingServicesListingPage />;
  }

  if (await shouldTryFetchMarketingServiceDetail(fullSlug)) {
    const [serviceData, overview, listingPath] = await Promise.all([
      fetchMarketingServiceData(fullSlug),
      fetchMarketingServicesOverviewData(),
      getMarketingServicesListingPath(),
    ]);
    if (serviceData) {
      const currentPath = `/${fullSlug}`.replace(/\/+$/, '') || '/';
      const canonical = serviceData.cmsDetailPath?.replace(/\/+$/, '') || currentPath;
      if (serviceData.cmsDetailPath && canonical !== currentPath) {
        permanentRedirect(serviceData.cmsDetailPath);
      }
      return (
        <MarketingServiceDetailView
          serviceData={serviceData}
          overview={overview}
          listingPath={listingPath}
        />
      );
    }
  }

  const data = await fetchPageData(fullSlug);

  if (!data) {
    notFound();
  }

  const Component = componentMap[data.type] || CmsPage;

  return <Component data={data} />;
}