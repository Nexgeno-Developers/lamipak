import Link from 'next/link';
import CompanyHero from '@/components/company/CompanyHero';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50">
      <CompanyHero
        data={{
          title: 'Page Not Found',
          backgroundImage: '/about_banner.jpg',
        }}
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-black mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              The page you are looking for does not exist.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back Home
            </Link>
          </div>
        </div>
      </section>

      <div className="bg-gray-50 pt-12">
        <CallToAction />
      </div>
      <NewsletterSubscription />
    </main>
  );
}
