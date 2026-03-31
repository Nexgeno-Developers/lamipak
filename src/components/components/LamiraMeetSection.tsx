import Image from 'next/image';

export interface LamiraMeetSectionData {
  titlePrefix?: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  storyTitle: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
}

interface LamiraMeetSectionProps {
  data: LamiraMeetSectionData;
}

function renderAsteriskBold(text?: string | null): React.ReactNode {
  if (!text) return null;
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, idx) => {
    const isBold = part.startsWith('*') && part.endsWith('*') && part.length >= 2;
    const value = isBold ? part.slice(1, -1) : part;
    return isBold ? (
      <strong key={idx} className="font-extrabold">
        {value}
      </strong>
    ) : (
      <span key={idx}>{value}</span>
    );
  });
}

export default function LamiraMeetSection({ data }: LamiraMeetSectionProps) {
  return (
    <section className="bg-gray-50 py-10 md:py-12">
      <div className="mx-auto w-full container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 md:gap-12 items-center">
          <div className="max-w-xl">
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight">
              <span className="text-[#00A0E3]">{renderAsteriskBold(data.titleHighlight)}</span>
            </h2>

            <h3 className="mt-4 text-xl md:text-2xl font-bold text-black">
              {renderAsteriskBold(data.storyTitle)}
            </h3>

            <div className="mt-4 space-y-4 text-sm md:text-base text-black leading-relaxed">
              {data.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{renderAsteriskBold(paragraph)}</p>
              ))}
            </div>

          </div>

          <div className="relative overflow-hidden rounded-[28px] md:rounded-[34px]">
            <div className="relative w-full aspect-[5/4] md:aspect-[4/3]">
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

