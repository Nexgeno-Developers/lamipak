import Image from 'next/image';

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
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-10 items-center">
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] bg-gray-50">
            <div className="relative w-full aspect-[5/3] md:aspect-[4/3]">
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
                priority={false}
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-[40px] font-bold text-[#111827] leading-tight">
              {data.headingPrefix ? `${data.headingPrefix} ` : ''}
              <span className="text-[#00A0E3]">{data.headingHighlight}</span>
              {data.headingSuffix ? ` ${data.headingSuffix}` : ''}
            </h2>
            <p className="mt-4 text-sm md:text-base text-[#1f2937] leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

