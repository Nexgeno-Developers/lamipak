import CompanyHero from '@/components/company/CompanyHero';
import CompanyNavigationServer from '@/components/company/CompanyNavigationServer';
import CompanyStatistics from '@/components/company/CompanyStatistics';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import VideoBanner from '@/components/home/VideoBanner';
import JourneyClient from '@/components/company/JourneyClient';
import { parseLdJsonSchema } from '@/components/seo/buildApiMetadata';
import { getCanonicalUrl } from '@/config/site';
import type { CompanyHero as CompanyHeroData, CompanyStatistic, JourneyData } from '@/fake-api/company';
import type { CompanyNavigationData } from '@/components/company/CompanyNavigation';

export function AboutUsPageSection({
  hero,
  statistics,
  journey,
  videoUrl,
  activePath,
  navigation,
  seo,
}: {
  hero: CompanyHeroData;
  statistics: CompanyStatistic[];
  journey: JourneyData;
  videoUrl?: string;
  activePath?: string;
  navigation?: CompanyNavigationData | null;
  /** From API `data.seo` (about_1 layout includes `schema`). */
  seo?: Record<string, unknown> | null;
}) {
  const parsedSchema = parseLdJsonSchema(seo?.schema);
  const rawCanonical = seo?.canonical_url;
  const path = (activePath || '/').replace(/\/$/, '') || '/';
  const canonicalUrl =
    typeof rawCanonical === 'string' && /^https?:\/\//i.test(rawCanonical)
      ? rawCanonical
      : getCanonicalUrl(
          typeof rawCanonical === 'string' && rawCanonical.trim()
            ? rawCanonical
            : `${path}/`,
        );
  const schemaData = parsedSchema != null ? { ...parsedSchema, url: canonicalUrl } : null;

  return (
    <>
      {schemaData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      ) : null}
    <main className="min-h-screen bg-gray-50">
      <CompanyHero data={hero} />
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={[{ label: 'About us' }]} />
        </div>
      </section>
      <CompanyNavigationServer activePath={activePath || '/about-us'} data={navigation} />
      <CompanyStatistics statistics={statistics} />
      <JourneyClient data={journey} />
      <VideoBanner videoOnly={true} videoUrl={videoUrl} />
      <div className="pt-10 md:pt-20">
        <CallToAction />
      </div>
      <NewsletterSubscription />
    </main>
    </>
  );
}

