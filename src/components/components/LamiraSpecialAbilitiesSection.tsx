import VideoModalClient from '@/components/common/VideoModalClient';

export interface LamiraSpecialAbilitiesSectionData {
  headingHighlight: string;
  headingSuffix: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  videoUrl: string;
  abilities: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

interface LamiraSpecialAbilitiesSectionProps {
  data: LamiraSpecialAbilitiesSectionData;
}

export default function LamiraSpecialAbilitiesSection({
  data,
}: LamiraSpecialAbilitiesSectionProps) {
  const abilities = data.abilities.slice(0, 2);
  const videoCardContent = abilities[0];

  return (
    <section className="bg-[#f3f3f3] py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-[#111827] leading-tight">
            <span className="text-[#00A0E3]">{data.headingHighlight}</span> {data.headingSuffix}
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#374151]">{data.subtitle}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-6 items-start">
          {/* Hover swap: show content first, then image + play button */}
          <div className="group relative overflow-hidden rounded-[22px] md:rounded-[26px] bg-white min-h-[260px]">
            {/* Content layer */}
            <div className="absolute inset-0 p-6 md:p-7 transition-opacity duration-300 opacity-100 group-hover:opacity-0 group-hover:pointer-events-none">
              <h3 className="text-base md:text-[16px] font-semibold text-[#111827]">
                {videoCardContent?.title}
              </h3>
              <p className="mt-3 text-xs md:text-sm text-[#1f2937] leading-relaxed">
                {videoCardContent?.description}
              </p>
            </div>

            {/* Media layer */}
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
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
            <article
              key={ability.id}
              className="group relative rounded-[22px] md:rounded-[26px] bg-[#E9ECEF] border-2 border-[#00A0E3] px-6 py-7 overflow-hidden min-h-[220px]"
            >
              {/* Text layer */}
              <div className="transition-opacity duration-300 opacity-100 group-hover:opacity-0 relative z-10 group-hover:pointer-events-none">
                <h3 className="text-base md:text-[16px] font-semibold text-[#111827]">{ability.title}</h3>
                <p className="mt-3 text-xs md:text-sm text-[#1f2937] leading-relaxed">
                  {ability.description}
                </p>
              </div>

              {/* Media layer */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                <div className="absolute inset-0 bg-black/15" />
                <VideoModalClient
                  videoUrl={data.videoUrl}
                  posterUrl={data.image}
                  posterAlt={data.imageAlt}
                  className="absolute inset-0"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

