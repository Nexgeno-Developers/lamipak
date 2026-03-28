import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import {
  fetchMarketingServiceData,
  getAllMarketingServiceSlugs,
  fetchMarketingServicesOverviewData,
  getMarketingServicesListingPath,
} from '@/lib/api';
import MarketingServiceDetailView from '@/components/marketing/MarketingServiceDetailView';
import { generateMarketingServiceDetailMetadata } from '@/components/marketing/generateMarketingServiceDetailMetadata';

interface MarketingServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllMarketingServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: MarketingServicePageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const serviceData = await fetchMarketingServiceData(slug);

  if (!serviceData) {
    return {
      title: 'Marketing Service Not Found',
      description: 'The requested marketing service could not be found.',
    };
  }

  const pathForCanonical = serviceData.cmsDetailPath || `/marketing-services/${slug}`;
  return generateMarketingServiceDetailMetadata(serviceData, pathForCanonical);
}

/**
 * Legacy `/marketing-services/:slug` — redirects to CMS `slug` path when it differs
 * (e.g. `/marketing-support-service/market-intelligence`).
 */
export default async function MarketingServiceDetailsPage({ params }: MarketingServicePageProps) {
  const { slug } = await params;
  const serviceData = await fetchMarketingServiceData(slug);

  if (!serviceData) {
    notFound();
  }

  const legacyPath = `/marketing-services/${slug}`;
  if (serviceData.cmsDetailPath && serviceData.cmsDetailPath !== legacyPath) {
    permanentRedirect(serviceData.cmsDetailPath);
  }

  const [overview, listingPath] = await Promise.all([
    fetchMarketingServicesOverviewData(),
    getMarketingServicesListingPath(),
  ]);

  return (
    <MarketingServiceDetailView
      serviceData={serviceData}
      overview={overview}
      listingPath={listingPath}
    />
  );
}
