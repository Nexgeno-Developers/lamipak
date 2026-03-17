import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchMarketingServiceData, getAllMarketingServiceSlugs, fetchMarketingServicesOverviewData } from '@/lib/api';
import { getCanonicalUrl } from '@/config/site';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import CompanyHero from '@/components/company/CompanyHero';
import VideoBanner from '@/components/home/VideoBanner';
import ConnectTechnicalExperts from '@/components/technical-services/ConnectTechnicalExperts';

interface MarketingServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllMarketingServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: MarketingServicePageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const serviceData = await fetchMarketingServiceData(slug);

  if (!serviceData) {
    return {
      title: 'Marketing Service Not Found',
      description: 'The requested marketing service could not be found.',
    };
  }

  const canonicalUrl = serviceData.seo.canonical_url
    ? getCanonicalUrl(serviceData.seo.canonical_url)
    : getCanonicalUrl(`/marketing-services/${slug}`);

  return {
    title: serviceData.seo.meta_title,
    description: serviceData.seo.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: serviceData.seo.meta_title,
      description: serviceData.seo.meta_description,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function MarketingServiceDetailsPage(
  { params }: MarketingServicePageProps,
) {
  const { slug } = await params;
  const [serviceData, overview] = await Promise.all([
    fetchMarketingServiceData(slug),
    fetchMarketingServicesOverviewData(),
  ]);

  if (!serviceData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section – reuse About Us / Company hero style */}
      <CompanyHero
        data={{
          title: serviceData.title,
          backgroundImage: serviceData.heroBackgroundImage || '/about_banner.jpg',
        }}
      />

      {/* Breadcrumbs */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs
            items={[
              { label: 'Marketing Services', href: '/marketing-services' },
              { label: serviceData.title },
            ]}
          />
        </div>
      </section>

      {/* Intro Section – two-column layout like reference design */}
      <section className="bg-gray-50">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Text content */}
            <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 xl:p-16">
              <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0E233C] mb-4 leading-snug">
                {serviceData.introSection ? (
                  <>
                    {serviceData.introSection.heading}{' '}
                    <span className="text-[#009FE8]">
                      {serviceData.introSection.headingHighlight}
                    </span>
                  </>
                ) : (
                  serviceData.title
                )}
              </h2>

              {serviceData.introSection ? (
                <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                  {serviceData.introSection.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                  {serviceData.description}
                </p>
              )}

              {serviceData.introSection && (
                <a
                  href={serviceData.introSection.ctaLink}
                  className="inline-flex items-center text-sm md:text-base font-semibold text-[#009FE8] hover:text-[#0077B6] transition-colors"
                >
                  {serviceData.introSection.ctaText}
                  <span className="ml-2 text-lg leading-none">→</span>
                </a>
              )}
            </div>
            </div>

            {/* Right: Image */}
            <div className="relative w-full overflow-hidden shadow-sm">
              <div className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={serviceData.introSection?.image || serviceData.listingImage}
                  alt={serviceData.introSection?.imageAlt || serviceData.listingImageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section – four cards with icons */}
      {serviceData.highlights.length > 0 && (
        <section className="bg-white py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {serviceData.highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="bg-[#F7F9FB] rounded-[24px] px-6 py-6 md:px-7 md:py-7 shadow-sm flex flex-col h-full"
                >
                  {highlight.icon && (
                    <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#E7F4FF]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={highlight.icon}
                        alt=""
                        className="w-5 h-5 object-contain"
                      />
                    </div>
                  )}
                  <h4 className="text-base md:text-lg font-semibold text-[#0E233C] mb-2">
                    {highlight.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

<VideoBanner videoOnly={true} />
       


      {/* Brand Journey Section – five cards row */}
      {serviceData.brandJourney && serviceData.brandJourney.items.length > 0 && (
        <section className="bg-gray-50 py-10 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">
              Elevate Your{' '}
              <span className="text-[#009FE8]">
                {serviceData.brandJourney.headingHighlight}
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {serviceData.brandJourney.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[24px] px-5 py-6 shadow-sm flex flex-col items-start"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-[#E7F4FF]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.icon}
                      alt=""
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-[#0E233C] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Connect with Marketing Experts – reuse shared component */}

       
      <section className="bg-gray-50 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <ConnectTechnicalExperts
            heading={overview.connectSection.heading}
            headingHighlight={overview.connectSection.headingHighlight}
            formTitle={overview.connectSection.formTitle}
            illustrationImage={overview.connectSection.illustrationImage}
            illustrationAlt={overview.connectSection.illustrationAlt}
          />
        </div>
      </section>

      <CallToAction />
      <NewsletterSubscription />
    </main>
  );
}

