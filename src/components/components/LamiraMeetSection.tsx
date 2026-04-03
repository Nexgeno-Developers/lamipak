import Image from 'next/image';
import { RichText } from '@/components/common/RichText';

export interface LamiraMeetSectionData {
  titlePrefix?: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  storyTitle: string;
  paragraphs: string[];
  /** Optional editor HTML body (supports h3/h4/p etc). */
  bodyHtml?: string;
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
              <span
                className="text-black"
                dangerouslySetInnerHTML={{ __html: data.titleHighlight }}
              />
            </h2>

            {data.subtitle ? (
              <p className="mt-3 text-sm md:text-base text-black leading-relaxed">
                {renderAsteriskBold(data.subtitle)}
              </p>
            ) : null}

            {/* <h3 className="mt-4 text-xl md:text-2xl font-bold text-black">
              {renderAsteriskBold(data.storyTitle)}
            </h3> */}

            {data.bodyHtml?.trim() ? (
              <RichText
                as="div"
                html={data.bodyHtml}
                className="mt-4 text-sm md:text-base text-black leading-relaxed
                  [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold
                  [&_h4]:mt-4 [&_h4]:text-lg [&_h4]:md:text-xl [&_h4]:font-bold
                  [&_p]:mt-2 [&_p]:leading-relaxed"
              />
            ) : (
              <div className="mt-4 space-y-4 text-sm md:text-base text-black leading-relaxed">
                {data.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{renderAsteriskBold(paragraph)}</p>
                ))}
              </div>
            )}

          </div>

          <div className="relative overflow-hidden rounded-[28px] md:rounded-[34px]">
            {data.image && (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

