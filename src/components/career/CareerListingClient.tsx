'use client';

import { formatBoldText } from '@/lib/htmlText';
import type { CareerLandingPageData, CareerJob } from '@/lib/api/career_layout';

function formatPostedDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}

type JobsSection = CareerLandingPageData['jobsSection'];
type SocialLinks = NonNullable<JobsSection>['socialApplyLinks'];

function SocialApplyLinks({ links }: { links: SocialLinks | undefined }) {
  if (!links) return null;
  const entries = (
    [
      ['Instagram', links.instagram] as const,
      ['LinkedIn', links.linkedin] as const,
      ['Facebook', links.facebook] as const,
    ] as const
  ).filter(([, url]) => typeof url === 'string' && url.trim().length > 0);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {entries.map(([label, url]) => (
        <a
          key={label}
          href={url!.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[#009FE8] bg-white px-4 py-2.5 text-xs font-semibold text-[#009FE8] transition hover:bg-[#009FE8] hover:text-white sm:px-6 sm:py-3 sm:text-sm md:text-base"
        >
          {label}
        </a>
      ))}
    </div>
  );
}

export default function CareerListingClient({
  jobsSection,
}: {
  jobs: CareerJob[];
  jobsSection?: JobsSection;
}) {
  const socialLinks = jobsSection?.socialApplyLinks;

  return (
    <section id="open-positions" className="bg-gray-50 pt-8 sm:py-10 md:py-12">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mt-2 text-center sm:mt-4">
          <h2
            className="px-1 text-xl font-bold leading-snug text-black sm:text-2xl md:text-4xl lg:text-5xl"
            dangerouslySetInnerHTML={{
              __html: jobsSection?.heading ?? 'See all open positions and early career opportunities',
            }}
          />
        </div>

        <div className="mt-6 sm:mt-8">
          <SocialApplyLinks links={socialLinks} />
        </div>
      </div>
    </section>
  );
}
