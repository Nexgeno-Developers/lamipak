import type { InnovationsPageData } from '@/lib/api/innovations_layout';
import InnovationsFeatureCards from '@/components/innovations/InnovationsFeatureCards';
import InnovationsHero from '@/components/innovations/InnovationsHero';
import InnovationsIntro from '@/components/innovations/InnovationsIntro';

export default function InnovationsLayoutPage({ data }: { data: InnovationsPageData }) {
  return (
    <main className="min-h-screen bg-white">
      <InnovationsHero heroTitle={data.heroTitle} heroBackgroundImage={data.heroBackgroundImage} />
      <InnovationsIntro
        introHeadingBlack={data.introHeadingBlack}
        introHeadingBlue={data.introHeadingBlue}
        introBody={data.introBody}
      />
      <InnovationsFeatureCards cards={data.featureCards} />
    </main>
  );
}
