import type { LatestInsightsData } from '@/fake-api/homepage';
import LatestInsightsSlider, { Navigation, Cards } from './LatestInsightsSlider';

interface LatestInsightsClientProps {
  data: LatestInsightsData;
}

export default function LatestInsightsClient({ data }: LatestInsightsClientProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <LatestInsightsSlider cards={data.cards}>
          {/* Header with Title and Navigation */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              <span className="text-gray-900">Latest</span>{' '}
              <span className="text-[#009FE8]">Insights</span>
            </h2>

            {/* Navigation Arrows - Client Component */}
            <Navigation cards={data.cards} />
          </div>

          {/* Cards Grid - Client Component with Slider */}
          <Cards cards={data.cards} />
        </LatestInsightsSlider>
      </div>
    </section>
  );
}
