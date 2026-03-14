import { fetchCompanyData } from '@/lib/api';
import CompanyNavigation from './CompanyNavigation';

/**
 * Company Navigation Server Component
 * 
 * Fetches navigation data server-side and passes it to the client component.
 */
export default async function CompanyNavigationServer() {
  const companyData = await fetchCompanyData();

  return <CompanyNavigation data={companyData.navigation} />;
}
