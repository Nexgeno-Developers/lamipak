import Image from 'next/image';
import type { CompanyHero as CompanyHeroType } from '@/fake-api/company';

interface CompanyHeroProps {
  data: CompanyHeroType;
}

/**
 * Company Hero Component (Server Component)
 * 
 * Displays a hero section with background image and dark blue overlay,
 * featuring the "ABOUT US" title centered in white.
 */
export default function CompanyHero({ data }: CompanyHeroProps) {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {data.backgroundImage ? (
          <Image
            src={data.backgroundImage}
            alt="About Us Background"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      {/* Dark Blue Overlay */}
      <div className="absolute inset-0 bg-[#003366] bg-opacity-70" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white uppercase tracking-wide">
          {data.title}
        </h1>
      </div>
    </section>
  );
}
