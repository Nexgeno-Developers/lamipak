import type { Metadata } from 'next';
import Link from 'next/link';
import CompanyHero from '@/components/company/CompanyHero';
import Image from 'next/image';
import LatestNewsClient from '@/components/marketing/LatestNewsClient';
import {
  fetchCompanyData,
  getAllMarketingServices,
  fetchMarketingServicesOverviewData,
  fetchMarketingLatestNews,
  fetchMarketingPressNews,
  getMarketingServicesListingPath,
} from '@/lib/api';
import { resolveSeoCanonicalUrl, SITE_CONFIG } from '@/config/site';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import ConnectTechnicalExperts from '@/components/technical-services/ConnectTechnicalExperts';

const defaultDescription =
  'Discover Lamipak marketing support services including brand strategy, 360° go‑to‑market campaigns, and insight‑driven packaging design.';

export async function generateMarketingServicesListingMetadata(): Promise<Metadata> {
  const [overview, listingPath] = await Promise.all([
    fetchMarketingServicesOverviewData(),
    getMarketingServicesListingPath(),
  ]);
  const seo = overview.seo;
  /** `<title>`: use CMS `seo.title` exactly (no site suffix). Fallback when API has no SEO block. */
  const rawTitle = seo?.title?.trim();
  const documentTitle = rawTitle
    ? rawTitle
    : `Marketing Services | ${SITE_CONFIG.name}`;
  /** `<meta name="description">`: exact CMS `seo.description` */
  const description = seo?.description?.trim() || defaultDescription;
  const canonical = resolveSeoCanonicalUrl(seo?.canonicalUrl ?? null, listingPath);

  /** `<meta name="keywords">`: exact CMS string (not re-split) */
  const keywordsRaw = seo?.keywords?.trim();

  const robots =
    seo?.robotsIndex || seo?.robotsFollow
      ? {
          index: seo.robotsIndex?.toLowerCase() !== 'noindex',
          follow: seo.robotsFollow?.toLowerCase() !== 'nofollow',
        }
      : undefined;

  const ogTitle = seo?.ogTitle?.trim() || rawTitle || 'Marketing Services';
  const ogDesc = seo?.ogDescription?.trim() || description;
  const twTitle = seo?.twitterTitle?.trim() || ogTitle;
  const twDesc = seo?.twitterDescription?.trim() || ogDesc;
  const ogImage = seo?.ogImageUrl?.trim();
  const twImage = seo?.twitterImageUrl?.trim() || ogImage;

  return {
    title: { absolute: documentTitle },
    description,
    ...(keywordsRaw ? { keywords: keywordsRaw } : {}),
    ...(robots ? { robots } : {}),
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: canonical,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: twImage ? 'summary_large_image' : 'summary',
      title: twTitle,
      description: twDesc,
      ...(twImage ? { images: [twImage] } : {}),
    },
  };
}

/**
 * Marketing services listing (360° section, stats, service rows, news, CTA).
 * Renders at `/marketing-services` or at the CMS `slug` path when configured.
 */
export default async function MarketingServicesListingPage() {
  const [companyData, marketingServices, overview, marketingNews, marketingPress] =
    await Promise.all([
      fetchCompanyData(),
      getAllMarketingServices(),
      fetchMarketingServicesOverviewData(),
      fetchMarketingLatestNews(),
      fetchMarketingPressNews(),
    ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {overview.seo?.schema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: overview.seo.schema }}
        />
      ) : null}
      <CompanyHero
        data={{
          ...companyData.hero,
          title: overview.pageTitle ?? 'Marketing Service',
          backgroundImage:
            overview.heroBackgroundImage || companyData.hero.backgroundImage,
        }}
      />

      <section className="bg-gray-50 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_50%] gap-[80px] items-center">
            <div className="w-full overflow-hidden rounded-[32px]">
              <Image
                src={overview.image}
                alt={overview.imageAlt}
                width={1600}
                height={1200}
                className="h-auto w-full max-w-full rounded-[32px]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-black font-bold mb-6 md:mb-6 leading-[70px]">
                {overview.heading}
              </h2>
              {overview.heroDescriptionHtml ? (
                <div
                  className="text-base text-black leading-relaxed mb-4 md:mb-6 [&_p]:mb-3 last:[&_p]:mb-0"
                  dangerouslySetInnerHTML={{ __html: overview.heroDescriptionHtml }}
                />
              ) : (
                <p className="text-base text-black leading-relaxed mb-4 md:mb-6">
                  {overview.description}
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 pt-10 md:pt-20">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl text-black lg:text-5xl font-bold mb-6 md:mb-2 text-center">
                {overview.statsHeading}
              </h3>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-6 text-[#009FE8] text-center">
                {overview.statsSubheading}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {overview.stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-[#EDF0F1] rounded-[50px] p-8 md:p-10  duration-300 flex flex-col text-start"
                >
                  <div className="mb-6 w-12 h-12 flex items-center justify-start">
                    <Image
                      src={stat.icon}
                      alt={stat.label}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000] mb-2">
                    {stat.value}
                  </p>
                  <p className="text-lg md:text-xl text-black font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-black text-center">
          {overview.listingHeading.replace(overview.listingHeadingHighlight, '').trim()}{' '}
          <span className="text-[#009FE8]">
            {overview.listingHeadingHighlight}
          </span>{' '}
        </h2>

        <div className="">
          {marketingServices.map((service, index) => {
            const isEven = index % 2 === 0;

            return (
              <div key={service.slug} className="">
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch ${
                    !isEven ? 'md:[&>div:first-child]:order-2 md:[&>div:last-child]:order-1' : ''
                  }`}
                >
                  <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 xl:p-16">
                    <div className="px-6 md:px-10 py-8 md:py-10">
                      <h3 className="text-lg md:text-xl lg:text-[36px] font-bold text-[#0E233C] mb-3">
                        {service.title}
                      </h3>
                      <p className="text-base text-black leading-relaxed mb-4 md:mb-6">
                        {service.shortDescription}
                      </p>
                      <Link
                        href={`/marketing-services/${service.slug}`}
                        className="inline-flex items-center text-sm md:text-[16px] font-bold text-[#009FE8] hover:text-[#0077B6] transition-colors"
                      >
                        Find out more
                        <span className="ml-2 text-lg leading-none">→</span>
                      </Link>
                    </div>
                  </div>

                  <div className="relative ">
                    <img
                      src={service.listingImage}
                      alt={service.listingImageAlt}
                      width={1000}
                      height={1000}
                      className=" w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <LatestNewsClient trendItems={marketingNews} pressItems={marketingPress} />

      <ConnectTechnicalExperts
        heading={overview.connectSection.heading}
        headingHighlight={overview.connectSection.headingHighlight}
        formTitle={overview.connectSection.formTitle}
        illustrationImage={overview.connectSection.illustrationImage}
        illustrationAlt={overview.connectSection.illustrationAlt}
      />

      <CallToAction />
      <NewsletterSubscription />
    </main>
  );
}
