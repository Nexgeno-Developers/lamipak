import Image from 'next/image';
import type { ProductData } from '@/fake-api/products';

interface ProductFeaturesProps {
  features: ProductData['productFeatures'];
}

/**
 * Product Features Component (Server Component)
 * 
 * Displays product features in a slider-like grid layout.
 * All data is fetched server-side from the API.
 */
export default function ProductFeatures({ features }: ProductFeaturesProps) {
  if (!features || features.length === 0) {
    return null;
  }

  // Display first 3 features (slider-like static display)
  const visibleFeatures = features.slice(0, 3);

  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
          Product Features
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {visibleFeatures.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-[25px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Feature Image */}
              <div className="relative h-64 md:h-72 overflow-hidden bg-gray-100">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Feature Content */}
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
