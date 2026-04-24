import CompanyHero from '@/components/company/CompanyHero';
import CompanyNavigation from '@/components/company/CompanyNavigation';
import AboutUsQuadrant from '@/components/company/AboutUsQuadrant';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import VideoBanner from '@/components/home/VideoBanner';
import type { DynamicPageData } from '@/fake-api/dynamic-pages';

export interface OurCompanyDynamicPageProps {
  data: DynamicPageData;
}

export default function OurCompanyDynamicPage({ data }: OurCompanyDynamicPageProps) {
  const companyData = data.ourCompanyData;
  const activeCompanyPath = `/${data.slug}`;

  if (!companyData) return null;

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <CompanyHero
          data={{
            ...companyData.hero,
            title: data.title,
          }}
        />

        <CompanyNavigation data={companyData.navigation} activePath={activeCompanyPath} />

        {companyData.aboutUsQuadrant ? (
          <AboutUsQuadrant
            data={companyData.aboutUsQuadrant}
            videoBetween={
              data.slug === 'introduction' ? (
                <div className="pt-6 md:pt-12">
                  <VideoBanner videoOnly={true} />
                </div>
              ) : null
            }
          />
        ) : null}

        <div className="pt-10 md:pt-20">
          <CallToAction />
        </div>
        <NewsletterSubscription />
      </main>
    </>
  );
}

