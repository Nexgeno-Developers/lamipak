import VideoModalClient from '@/components/common/VideoModalClient';
import { RichText } from '@/components/common/RichText';
import type { LamiraSpecialAbilitiesSectionData } from '@/lib/api/sustainability_layout_2';

interface LamiraSpecialAbilitiesSectionProps {
  data: LamiraSpecialAbilitiesSectionData;
}

const cardSurface =
  'rounded-[24px] md:rounded-[36px] bg-[#EDF0F1]';

const richTextProse =
  '[&_h4]:text-[17px] [&_h4]:md:text-xl [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:tracking-tight [&_p]:mt-3 [&_p]:text-[14px] [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:text-gray-800 [&_p:last-child]:mb-0';

export default function LamiraSpecialAbilitiesSection({
  data,
}: LamiraSpecialAbilitiesSectionProps) {
  if (data.layoutVariant === 'three-column-html') {
    const poster = data.videoPosterUrl || data.image;
    return (
      <section className="bg-gray-50 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <header className="mx-auto mb-8 max-w-3xl text-center md:mb-12">
            <h2
              className="text-[22px] font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl [&_span]:text-[#00AEEF]"
              dangerouslySetInnerHTML={{ __html: data.heading }}
            />
            {data.subtitle ? (
              <p className="mt-3 text-sm leading-relaxed text-gray-700 md:mt-4 md:text-base">
                {data.subtitle}
              </p>
            ) : null}
          </header>

          {/* Mobile: stack text → video → text; Desktop: 3 columns */}
          <div className="flex flex-col gap-5 md:gap-6 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-6 xl:gap-8">
            <div className={`${cardSurface} flex min-h-0 flex-col p-5 sm:p-6 md:p-7 ${richTextProse}`}>
              {data.card1Html ? <RichText as="div" html={data.card1Html} /> : null}
            </div>

            <div
              className={`${cardSurface} relative order-none flex min-h-[200px] w-full overflow-hidden lg:min-h-[280px]`}
            >
              {data.videoUrl ? (
                <div className="relative aspect-video w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:min-h-[240px]">
                  <VideoModalClient
                    videoUrl={data.videoUrl}
                    posterUrl={poster}
                    posterAlt={data.imageAlt || 'Video'}
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex min-h-[200px] flex-1 items-center justify-center text-sm text-gray-500">
                  Video coming soon
                </div>
              )}
            </div>

            <div className={`${cardSurface} flex min-h-0 flex-col p-5 sm:p-6 md:p-7 ${richTextProse}`}>
              {data.card3Html ? <RichText as="div" html={data.card3Html} /> : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const abilities = data.abilities.slice(0, 2);
  const videoCardContent = abilities[0];

  return (
    <section className="bg-gray-50 pb-8 md:py-12">
      <div className="mx-auto px-4 container">
        <div className="text-center max-w-4xl mx-auto">
          <h2
            className="text-[22px] md:text-5xl font-bold text-black leading-tight"
            dangerouslySetInnerHTML={{ __html: data.heading }}
          />
          <p className="mt-3 text-sm md:text-base text-black">{data.subtitle}</p>
        </div>

        <div className="lg:mt-8 mt-4 grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] lg:gap-6 gap-4 items-start">
          <div className="group relative overflow-hidden rounded-[50px] bg-[#EDF0F1] h-[250px]">
            <div className="absolute inset-0 p-6 md:p-7 transition-opacity duration-300 opacity-100 group-hover:opacity-0 group-hover:pointer-events-none">
              <h3 className="text-base md:text-[20px] font-semibold text-black">
                {videoCardContent?.title}
              </h3>
              <p className="mt-3 text-xs md:text-base text-black leading-relaxed">
                {videoCardContent?.description}
              </p>
            </div>

            <div className="rounded-[50px]  absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
              <div className="absolute inset-0 bg-black/15" />
              <VideoModalClient
                videoUrl={data.videoUrl}
                posterUrl={data.image}
                posterAlt={data.imageAlt}
                className="absolute inset-0"
              />
            </div>
          </div>

          {abilities.map((ability) => (
            <div
              key={ability.id}
              className="group relative overflow-hidden rounded-[50px] bg-[#EDF0F1] h-[250px]"
            >
              <div className="p-6 md:p-7 transition-opacity duration-300 opacity-100 group-hover:opacity-0 relative z-10 group-hover:pointer-events-none">
                <h3 className="text-base md:text-[20px] font-semibold text-[#111827]">
                  {ability.title}
                </h3>
                <p className="mt-3 text-xs md:text-base text-black leading-relaxed">
                  {ability.description}
                </p>
              </div>

              <div className="rounded-[50px] absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                <div className="absolute inset-0 bg-black/15" />
                <VideoModalClient
                  videoUrl={data.videoUrl}
                  posterUrl={data.image}
                  posterAlt={data.imageAlt}
                  className="absolute inset-0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
