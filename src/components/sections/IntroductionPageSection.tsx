import CompanyHero from '@/components/company/CompanyHero';
import CompanyNavigationServer from '@/components/company/CompanyNavigationServer';
import AboutUsQuadrant from '@/components/company/AboutUsQuadrant';
import VideoBanner from '@/components/home/VideoBanner';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import type { AboutUsLayout2PageData } from '@/lib/api/about_us_layout_2';

export function IntroductionPageSection({
  data,
  activePath,
}: {
  data: AboutUsLayout2PageData;
  activePath?: string;
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      <CompanyHero
        data={{
          title: data.title,
          backgroundImage: data.heroBackgroundImage || '',
        }}
      />

      <CompanyNavigationServer activePath={activePath || '/introduction'} />

      <AboutUsQuadrant
        data={data.quadrant}
        videoBetween={
          data.videoUrl ? (
            <div className="pt-6 md:pt-12">
              <VideoBanner videoOnly={true} videoUrl={data.videoUrl} />
            </div>
          ) : null
        }
      />

      <div className="pt-10 md:pt-20">
        <CallToAction />
      </div>
      <NewsletterSubscription />
    </main>
  );
}

