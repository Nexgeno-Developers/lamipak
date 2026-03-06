import type { Hero as HeroType } from '@/fake-api/homepage';

interface HeroProps {
  data: HeroType;
}

export default function Hero({ data }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {data.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            {data.subtitle}
          </p>
          <a
            href={data.ctaLink}
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors"
          >
            {data.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
