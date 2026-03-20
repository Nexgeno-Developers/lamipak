export interface LamiraLovesSectionData {
  headingPrefix?: string;
  headingHighlight: string;
  headingSuffix?: string;
  subtitle: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }>;
}

interface LamiraLovesSectionProps {
  data: LamiraLovesSectionData;
}

export default function LamiraLovesSection({ data }: LamiraLovesSectionProps) {
  return (
    <section className="bg-gray-50 py-10 md:py-12">
      <div className="mx-auto container px-4 ">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight">
            {data.headingPrefix ? `${data.headingPrefix} ` : ''}
            <span className="text-[#00A0E3]">{data.headingHighlight}</span>{' '}
            {data.headingSuffix ? data.headingSuffix : ''}
          </h2>
          <p className="mt-3 text-sm md:text-base text-black">{data.subtitle}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.items.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-[50px] px-5 py-5"
            >
              <div className="relative overflow-hidden rounded-[28px] md:rounded-[30px]">
                {/* Use normal <img> so height is truly auto (no fixed aspect ratio). */}
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="block w-full h-auto"
                  loading="lazy"
                />
              </div>

              <h3 className="mt-6 text-xl md:text-2xl font-bold text-[#00A0E3]">{item.title}</h3>
              <p className="mt-2 text-sm md:text-base text-[#1f2937] leading-relaxed mb-4">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

