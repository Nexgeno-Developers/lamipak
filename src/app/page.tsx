import { fetchHomepageData } from '@/lib/api';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import Products from '@/components/home/Products';
import Testimonials from '@/components/home/Testimonials';

/**
 * Homepage Component
 * 
 * Server Component that fetches all homepage data in a single API call
 * and passes section data to child components.
 */
export default async function HomePage() {
  // Single API call to fetch all homepage sections
  const homepageData = await fetchHomepageData();

  return (
    <main>
      <Hero data={homepageData.hero} />
      <Services services={homepageData.services} />
      <Products products={homepageData.products} />
      <Testimonials testimonials={homepageData.testimonials} />
    </main>
  );
}
