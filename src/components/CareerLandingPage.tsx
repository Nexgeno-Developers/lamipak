import Image from 'next/image';
import Link from 'next/link';
import { formatBoldText } from '@/lib/htmlText';
import type { CareerLandingPageData } from '@/lib/api/career_layout';
import CompanyHero from '@/components/company/CompanyHero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import VideoModalClient from '@/components/common/VideoModalClient';
import { RichText } from '@/components/common/RichText';
import VerticalTabsFeatures from '@/components/technical-services/VerticalTabsFeatures';
import ConnectTechnicalExperts from '@/components/technical-services/ConnectTechnicalExperts';
import CareerListingClient from '@/components/career/CareerListingClient';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';

export interface CareerLandingPageProps {
  data: CareerLandingPageData;
}

export default function CareerLandingPage({ data }: CareerLandingPageProps) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      <CompanyHero
        data={{
          title: data.heroTitle,
          backgroundImage: data.heroBackgroundImage || '/about_banner.jpg',
        }}
      />

      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={[{ label: 'Career' }]} />
        </div>
      </section>

      {data.heroSplit && (
        <section className="bg-gray-50 pt-6 sm:pt-8 md:pt-20">
          <div className="grid grid-cols-1 items-stretch gap-0 lg:grid-cols-2">
            <div className="flex items-center justify-center px-4 pb-8 pt-2 sm:px-6 sm:pb-10 lg:pb-0 lg:pl-16 lg:pr-10 lg:pt-0">
              <div className="w-full max-w-xl">
                <h2
                  className="mb-4 text-[22px] font-bold leading-[1.2] text-black sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl"
                  dangerouslySetInnerHTML={{ __html: formatBoldText(data.heroSplit.heading) }}
                />

                {data.heroSplit.bodyHtml ? (
                  <RichText
                    html={data.heroSplit.bodyHtml}
                    className="lg:mt-8 mt-4 space-y-4 text-sm font-normal leading-relaxed text-[#0E233C] md:text-lg [&_p]:mb-0 [&_p+_p]:mt-4"
                  />
                ) : (
                  <>
                    {data.heroSplit.paragraphs.length > 0 ? (
                      <div className="lg:mt-8 mt-4 space-y-4 text-base font-normal leading-relaxed text-[#0E233C] md:text-lg">
                        {data.heroSplit.paragraphs.map((p, i) => (
                          <p key={i} dangerouslySetInnerHTML={{ __html: formatBoldText(p) }} />
                        ))}
                      </div>
                    ) : null}
                    {data.heroSplit.emphasis ? (
                      <p className="lg:mt-8 mt-4 text-base font-semibold text-[#0E233C] md:text-lg">{data.heroSplit.emphasis}</p>
                    ) : null}
                  </>
                )}

                <Link
                  href={data.heroSplit.ctaLink}
                  className="lg:mt-8 mt-4 inline-flex min-h-[44px] items-center text-sm font-bold uppercase text-[#009FE8] transition-colors hover:text-[#0077B6] sm:mt-10 md:text-base"
                >
                  {data.heroSplit.ctaText}
                  <span className="ml-2 text-lg leading-none">→</span>
                </Link>
              </div>
            </div>

            <div className="relative min-h-[220px] overflow-hidden sm:min-h-[280px] lg:min-h-[460px]">
              {data.heroSplit.mediaLink ? (
                <VideoModalClient
                  videoUrl={data.heroSplit.mediaLink}
                  posterUrl={data.heroSplit.mediaImage}
                  posterAlt={data.heroSplit.mediaAlt}
                  className="absolute inset-0"
                />
              ) : (
                <Image
                  src={data.heroSplit.mediaImage}
                  alt={data.heroSplit.mediaAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </section>
      )}

      <CareerListingClient jobs={data.jobs} jobsSection={data.jobsSection} />

      {data.leadershipMessage && (
        <section className="bg-gray-50 py-8 md:py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-3xl bg-white p-4 sm:p-6 md:rounded-[50px] md:p-10 lg:p-12">
              <div className="grid grid-cols-1 items-start gap-8 sm:gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
                <div className="w-full min-w-0">
                  <div className="">
                    <div className="relative w-full overflow-hidden rounded-3xl md:rounded-[50px]">
                      <Image
                        src={data.leadershipMessage.image}
                        alt={data.leadershipMessage.imageAlt}
                        width={900}
                        height={1200}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="mt-5 text-center font-semibold text-[#0E233C]">
                    {data.leadershipMessage.name}{' '}
                    <span className="font-normal text-gray-600">
                      {data.leadershipMessage.role
                        ? `| ${data.leadershipMessage.role}`
                        : ''}
                    </span>
                  </p>
                </div>

                <div className="min-w-0 max-w-3xl">
                  <h2
                    className="mb-4 text-xl font-bold leading-snug text-black sm:text-2xl md:mb-5 md:text-3xl lg:text-5xl"
                    dangerouslySetInnerHTML={{ __html: formatBoldText(data.leadershipMessage.heading) }}
                  />
                  {data.leadershipMessage.bodyHtml ? (
                    <RichText
                      html={data.leadershipMessage.bodyHtml}
                      className="space-y-5 text-sm leading-relaxed text-black md:text-base [&_p]:mb-0 [&_p+_p]:mt-5"
                    />
                  ) : (
                    <div className="space-y-5 text-sm leading-relaxed text-black md:text-base">
                      {data.leadershipMessage.paragraphs.map((p, i) => (
                        <p key={i} dangerouslySetInnerHTML={{ __html: formatBoldText(p) }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {data.verticalFeatures && data.verticalFeatures.length > 0 && (
        <>
          {data.verticalFeaturesHeader && (
            <section className="bg-gray-50 pb-2 pt-4 sm:pt-6">
              <div className="container mx-auto max-w-7xl px-4 sm:px-6">
                <div className="mx-auto max-w-3xl px-1 text-center sm:px-0">
                  <h2
                    className="text-xl font-bold leading-snug text-black sm:text-2xl md:text-3xl lg:text-5xl"
                    dangerouslySetInnerHTML={{ __html: formatBoldText(data.verticalFeaturesHeader.heading) }}
                  />
                  {data.verticalFeaturesHeader.description ? (
                    /<[^>]+>/.test(data.verticalFeaturesHeader.description) ? (
                      <RichText
                        html={data.verticalFeaturesHeader.description}
                        className="mt-3 text-sm text-gray-600 md:text-base [&_p]:mb-0 [&_p+_p]:mt-3"
                      />
                    ) : (
                      <p className="mt-3 text-sm text-gray-600 md:text-base">
                        {data.verticalFeaturesHeader.description}
                      </p>
                    )
                  ) : null}
                </div>
              </div>
            </section>
          )}
          <VerticalTabsFeatures features={data.verticalFeatures} />
        </>
      )}

      {data.expertsSection && data.expertsSection.videos.length > 0 && (
        <section className="bg-gray-50 py-8 md:py-12 lg:py-12">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto mb-8 max-w-4xl px-1 text-center md:mb-12 sm:px-0">
              <h2
                className="text-xl font-bold leading-tight text-black sm:text-2xl md:text-3xl lg:text-5xl"
                dangerouslySetInnerHTML={{ __html: formatBoldText(data.expertsSection.heading) }}
              />
              {data.expertsSection.description ? (
                /<[^>]+>/.test(data.expertsSection.description) ? (
                  <RichText
                    html={data.expertsSection.description}
                    className="mt-4 text-sm text-gray-600 md:text-base [&_p]:mb-0 [&_p+_p]:mt-3"
                  />
                ) : (
                  <p className="mt-4 text-sm text-gray-600 md:text-base">{data.expertsSection.description}</p>
                )
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 md:gap-8">
              {data.expertsSection.videos.map((v) => (
                <div key={v.id} className="min-w-0">
                  <div className="relative overflow-hidden rounded-3xl md:rounded-[50px]">
                    <div className="relative w-full pt-[56.25%]">
                      <VideoModalClient
                        videoUrl={v.videoUrl}
                        posterUrl={v.thumbnail}
                        posterAlt={v.thumbnailAlt}
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ConnectTechnicalExperts />

      <div className="bg-gray-50">
        <CallToAction />
      </div>

      <NewsletterSubscription />
    </main>
  );
}
