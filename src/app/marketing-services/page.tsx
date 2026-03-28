import { permanentRedirect } from 'next/navigation';
import { getMarketingServicesListingPath } from '@/lib/api';
import MarketingServicesListingPage, {
  generateMarketingServicesListingMetadata,
} from '@/components/marketing/MarketingServicesListingPage';

export const generateMetadata = generateMarketingServicesListingMetadata;

/**
 * Legacy `/marketing-services` entry: redirects to the CMS listing path when it differs.
 */
export default async function MarketingServicesPage() {
  const path = await getMarketingServicesListingPath();
  if (path !== '/marketing-services') {
    permanentRedirect(path);
  }
  return <MarketingServicesListingPage />;
}
