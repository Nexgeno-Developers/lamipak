import Image from 'next/image';
import type { AboutUsQuadrantSection } from '@/fake-api/company';

interface AboutUsQuadrantProps {
  data: AboutUsQuadrantSection;
}

/**
 * About Us Quadrant Section Component (Server Component)
 * 
 * Displays a four-quadrant layout:
 * - Top Left: Text content
 * - Top Right: Image
 * - Bottom Left: Image
 * - Bottom Right: Text content
 * 
 * Full width section with no container constraints.
 */
export default function AboutUsQuadrant({ data }: AboutUsQuadrantProps) {
  return (
    <section className="w-full bg-gray-50">
      {/* Four Quadrant Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Top Left - Text Content */}
        <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 xl:p-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-[70px]">
              <span className="text-[#009FE8]">{data.topLeft.titleHighlight}</span>
              <span className="text-gray-900">
                {data.topLeft.title.replace(data.topLeft.titleHighlight, '').trim()}
              </span>
            </h2>
            {data.topLeft.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-base md:text-lg text-gray-700 leading-relaxed ${
                  index < data.topLeft.paragraphs.length - 1 ? 'mb-4 md:mb-6' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Top Right - Image */}
        <div className="relative w-full">
          {data.topRight.image ? (
            <div className="relative w-full">
              <Image
                src={data.topRight.image}
                alt={data.topRight.imageAlt}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="w-full h-auto bg-gray-200" style={{ aspectRatio: '4/3' }} />
          )}
        </div>

        {/* Bottom Left - Image */}
        <div className="relative w-full order-3 lg:order-3">
          {data.bottomLeft.image ? (
            <div className="relative w-full">
              <Image
                src={data.bottomLeft.image}
                alt={data.bottomLeft.imageAlt}
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ) : (
            <div className="w-full h-auto bg-gray-200" style={{ aspectRatio: '4/3' }} />
          )}
        </div>

        {/* Bottom Right - Text Content */}
        <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 xl:p-16 order-4 lg:order-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-[70px]">
              <span className="text-gray-900">
                {data.bottomRight.title.split(data.bottomRight.titleHighlight)[0]}
              </span>
              <span className="text-[#009FE8]">{data.bottomRight.titleHighlight}</span>
            </h2>
            {data.bottomRight.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={`text-base md:text-lg text-gray-700 leading-relaxed ${
                  index < data.bottomRight.paragraphs.length - 1 ? 'mb-4 md:mb-6' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
