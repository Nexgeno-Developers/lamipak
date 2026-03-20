import Image from 'next/image';
import type { DynamicPageData } from '@/fake-api/dynamic-pages';

type SectionData = NonNullable<DynamicPageData['ngosCircularFutureSection']>;

export interface NgoCircularFutureSectionProps {
  data: SectionData;
}

export default function NgoCircularFutureSection({ data }: NgoCircularFutureSectionProps) {
  const accent = data.accentColor ?? '#00AEEF';
  const bg = data.backgroundColor ?? '#f9f9f9';

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: bg }}>
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <header className="mx-auto mb-14 max-w-3xl text-center md:mb-20">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-[2.5rem] lg:leading-snug">
            <span style={{ color: accent }}>{data.heroHeadingBlue}</span>{' '}
            <span className="text-gray-900">{data.heroHeadingBlack}</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-900 md:mt-8 md:text-lg">
            {data.heroIntro}
          </p>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="order-2 lg:order-1">
            <h3 className="text-xl font-bold uppercase leading-snug tracking-tight text-gray-900 md:text-2xl lg:text-[1.65rem]">
              <span className="text-gray-900">{data.featureHeadingBlack}</span>{' '}
              <span style={{ color: accent }}>{data.featureHeadingBlue}</span>
            </h3>
            <p className="mt-6 text-left text-base leading-relaxed text-gray-900 md:mt-8 md:text-lg">
              {data.featureBody}
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full overflow-hidden rounded-[36px] md:rounded-[40px]">
              <div className="relative aspect-[4/3] w-full md:aspect-[16/11] lg:aspect-[5/4]">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
