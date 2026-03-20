export interface LamiraSharedGuideSectionData {
  image: string;
  imageAlt: string;
  headingPrefix?: string;
  headingHighlight: string;
  headingSuffix?: string;
  description: string;
}

interface LamiraSharedGuideSectionProps {
  data: LamiraSharedGuideSectionData;
}

export default function LamiraSharedGuideSection({
  data,
}: LamiraSharedGuideSectionProps) {
  return (
    <section className="bg-gray-50 py-10 md:py-12">
      <div className="mx-auto px-4 container">
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center">
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] bg-gray-50">
            {/* Use normal <img> so height becomes content-driven (auto). */}
            <img
              src={data.image}
              alt={data.imageAlt}
              className="block w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#111827] leading-tight">
              {data.headingPrefix ? `${data.headingPrefix} ` : ''}
              <span className="text-[#00A0E3]">{data.headingHighlight}</span>
              {data.headingSuffix ? ` ${data.headingSuffix}` : ''}
            </h2>
            <p className="mt-4 text-sm md:text-base text-black leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

