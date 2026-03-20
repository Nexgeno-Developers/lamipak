import Image from 'next/image';

export interface LamiraSocialWorldMomentsSectionData {
  headingPrefix: string;
  headingHighlight: string;
  headingSuffix?: string;
  items: Array<{
    id: string;
    image: string;
    imageAlt: string;
  }>;
}

interface LamiraSocialWorldMomentsSectionProps {
  data: LamiraSocialWorldMomentsSectionData;
}

export default function LamiraSocialWorldMomentsSection({
  data,
}: LamiraSocialWorldMomentsSectionProps) {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            {data.headingPrefix} <span className="text-[#00A0E3]">{data.headingHighlight}</span>
            {data.headingSuffix ? ` ${data.headingSuffix}` : ''}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="rounded-[32px] overflow-hidden bg-gray-50"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

