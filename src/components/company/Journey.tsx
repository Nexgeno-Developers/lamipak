import { fetchCompanyData } from '@/lib/api';
import JourneyClient from './JourneyClient';

/**
 * Journey Server Component
 * 
 * Fetches journey data server-side and passes it to the client component.
 */
export default async function Journey() {
  const companyData = await fetchCompanyData();

  return <JourneyClient data={companyData.journey} />;
}
