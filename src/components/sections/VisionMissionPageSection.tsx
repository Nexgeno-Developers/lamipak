import CompanyHero from '@/components/company/CompanyHero';
import CompanyNavigation from '@/components/company/CompanyNavigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import VisionMission from '@/components/company/VisionMission';
import OurValues from '@/components/company/OurValues';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import type { DynamicPageData } from '@/fake-api/dynamic-pages';

export function VisionMissionPageSection({ data }: { data: DynamicPageData }) {
  const companyData = data.ourCompanyData;
  if (!companyData) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <CompanyHero
        data={{
          ...companyData.hero,
          title: data.title,
        }}
      />
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={[{ label: data.title }]} />
        </div>
      </section>

      <CompanyNavigation data={companyData.navigation} activePath={`/${data.slug}`} />

      {companyData.visionMission ? <VisionMission data={companyData.visionMission} /> : null}
      {companyData.ourValues ? <OurValues data={companyData.ourValues} /> : null}

      <div className="pt-0 md:pt-12 bg-gray-50">
        <CallToAction />
      </div>
      <NewsletterSubscription />
    </main>
  );
}

