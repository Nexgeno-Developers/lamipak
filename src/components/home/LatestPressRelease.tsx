import Image from 'next/image';
import Link from 'next/link';
import { fetchHomepageData } from '@/lib/api';
import type { PressReleaseCard } from '@/fake-api/homepage';

/**
 * Latest Press Release Component (Server Component)
 * 
 * Fetches homepage data server-side and renders the section with press release cards.
 */
export default async function LatestPressRelease() {
  const homepageData = await fetchHomepageData();
  const data = homepageData.latestPressRelease;

  const cardsPerView = 3;
  const visibleCards = data.cards.slice(0, cardsPerView);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="text-gray-900">Latest</span>{' '}
            <span className="text-[#009FE8] underline">Press Release</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {visibleCards.map((card) => (
            <PressReleaseCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Press Release Card Component
 */
function PressReleaseCard({ card }: { card: PressReleaseCard }) {
  return (
    <div className="bg-white rounded-[25px] overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        {/* Category */}
        <div className="mb-3">
          <span className="text-sm md:text-base font-medium text-[#009FE8]">
            {card.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold mb-4 flex-1 text-gray-900">
          {card.title}
        </h3>

        {/* CTA Link */}
        <Link
          href={card.link}
          className="inline-flex items-center text-[#009FE8] text-base md:text-lg font-medium hover:opacity-80 transition-opacity group mt-auto"
        >
          Learn More
          <svg
            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
