import { fetchHeaderData } from '@/lib/api';
import MobileMenuClient from './MobileMenuClient';

/**
 * Mobile Menu Component (Server Component)
 * 
 * Fetches navigation data server-side and passes it to client component
 * for interactivity.
 */
export default async function MobileMenu() {
  const headerData = await fetchHeaderData();

  return <MobileMenuClient navigation={headerData.navigation} />;
}
