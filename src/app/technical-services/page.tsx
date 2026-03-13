import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllTechnicalServices, fetchTechnicalServicesListingData } from '@/lib/api';
import { getCanonicalUrl } from '@/config/site';

/**
 * Generate metadata for technical services listing page
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Technical Services | Lamipak - Expert Packaging Solutions',
    description: 'Explore our comprehensive technical services including product development, technical consultation, quality assurance, and pilot plant services.',
    alternates: {
      canonical: getCanonicalUrl('/technical-services'),
    },
    openGraph: {
      title: 'Technical Services | Lamipak',
      description: 'Expert technical services for innovative packaging solutions',
      url: getCanonicalUrl('/technical-services'),
      type: 'website',
    },
  };
}

/**
 * Technical Services Listing Page Component
 * 
 * Server Component that fetches all technical services and displays them in a grid.
 * All data is fetched server-side from the API.
 */
export default async function TechnicalServicesPage() {
  const services = await getAllTechnicalServices();
  const listingData = await fetchTechnicalServicesListingData();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-[220px] pb-[150px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {listingData.heroBackgroundImage ? (
            <img
              src={listingData.heroBackgroundImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-800" />
          )}
          {/* Dark Blue Overlay */}
          <div className="absolute inset-0 bg-[#0e233ce8] opacity-90" />
          {/* Blur Effect */}
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="container mx-auto flex-1 flex flex-col justify-center px-4">
            <div className="text-center">
              {/* Service Title */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-6xl font-bold text-white tracking-tight">
                {listingData.heroTitle}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Support Service Section */}
      <section className="bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
          {/* Left Column - Text Content */}
          <div className="container mx-auto px-4 lg:px-16 xl:px-24">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0e233c] mb-6">
              {listingData.introSection.heading}
            </h2>
            {listingData.introSection.paragraphs.map((paragraph, index) => (
              <p key={index} className={`text-lg md:text-xl text-gray-700 leading-relaxed ${index < listingData.introSection.paragraphs.length - 1 ? 'mb-4' : ''}`}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Right Column - Image (Full Width) */}
          <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px]">
            <img
              src={listingData.introSection.image}
              alt={listingData.introSection.imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        {services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No technical services available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/**
 * Service Card Component
 */
function ServiceCard({ service }: { service: Awaited<ReturnType<typeof getAllTechnicalServices>>[number] }) {
  return (
    <Link
      href={`/technical-services/${service.slug}`}
      className="group bg-white rounded-[25px] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Service Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Service Info */}
      <div className="p-6 md:p-8 flex-1 flex flex-col">
        {/* Category */}
        {service.category && (
          <span className="inline-block text-[#009FE8] text-sm md:text-base font-medium mb-3">
            {service.category}
          </span>
        )}

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#009FE8] transition-colors">
          {service.title}
        </h2>

        {/* Short Description or Description */}
        <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
          {service.shortDescription || service.description}
        </p>

        {/* CTA */}
        <div className="flex items-center text-[#009FE8] font-medium group-hover:text-[#0077B6] transition-colors">
          Learn More
          <svg
            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
