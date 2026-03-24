import Link from 'next/link';

/**
 * Global Not Found Page
 * 
 * This page is displayed when a route is not found.
 * It's used globally across the entire application.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-black mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-black mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-block bg-[#009FE8] text-white px-6 py-3 rounded-lg hover:bg-[#0077B6] transition-colors"
          >
            Go Back Home
          </Link>
          <Link
            href="/products"
            className="inline-block bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
