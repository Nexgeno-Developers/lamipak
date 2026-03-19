import Image from 'next/image';
import Link from 'next/link';
import CompanyHero from '@/components/company/CompanyHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import type { DynamicPageData } from '@/fake-api/dynamic-pages';

export interface LamiraPageProps {
  data: DynamicPageData;
}

export default function LamiraPage({ data }: LamiraPageProps) {
  const sections = data.sections ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      <CompanyHero
        data={{
          title: data.title,
          backgroundImage:
            typeof data.heroBackgroundImage === 'string' ? data.heroBackgroundImage : '/about_banner.jpg',
        }}
      />

      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs
            items={[
              {
                label: data.breadcrumbs?.parentLabel || 'Home',
                href: data.breadcrumbs?.parentHref || '/',
              },
              { label: data.title },
            ]}
          />
        </div>
      </section>

      

      <CallToAction />
      <NewsletterSubscription />
    </main>
  );
}

