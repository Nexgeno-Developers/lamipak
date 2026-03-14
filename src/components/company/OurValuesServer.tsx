import { fetchCompanyData } from '@/lib/api';
import OurValues from './OurValues';

/**
 * Our Values Server Component
 * 
 * Fetches values data server-side and passes it to the client component.
 */
export default async function OurValuesServer() {
  const companyData = await fetchCompanyData();

  if (!companyData.ourValues) {
    return null;
  }

  return <OurValues data={companyData.ourValues} />;
}
