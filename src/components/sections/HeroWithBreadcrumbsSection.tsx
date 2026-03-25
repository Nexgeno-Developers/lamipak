import CompanyHero from '@/components/company/CompanyHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import type { HeroWithBreadcrumbsSectionData } from '@/fake-api/page-builder';

export function HeroWithBreadcrumbsSection({ data }: { data: HeroWithBreadcrumbsSectionData }) {
  return (
    <>
      <CompanyHero
        data={{
          title: data.title,
          backgroundImage: data.backgroundImage || '/about_banner.jpg',
        }}
      />

      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={data.breadcrumbs} />
        </div>
      </section>
    </>
  );
}

