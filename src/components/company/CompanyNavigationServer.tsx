import { fetchCompanyData } from '@/lib/api';
import CompanyNavigation from './CompanyNavigation';

interface CompanyNavigationServerProps {
  activePath?: string;
}

/**
 * Company Navigation Server Component
 * 
 * Fetches navigation data server-side and passes it to the component.
 */
export default async function CompanyNavigationServer({ activePath }: CompanyNavigationServerProps) {
  const companyData = await fetchCompanyData();

  return <CompanyNavigation data={companyData.navigation} activePath={activePath} />;
}
