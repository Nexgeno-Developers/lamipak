import Link from 'next/link';
import { fetchHeaderData } from '@/lib/api';
import MobileMenu from './MobileMenu';
import NavigationDropdown from './NavigationDropdown';

/**
 * Header Component
 * 
 * Server Component that fetches header data from API
 */
export default async function Header() {
  const headerData = await fetchHeaderData();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          {/* Logo */}
          <Link href={headerData.logo.href} className="flex items-center">
            {headerData.logo.image ? (
              <img
                src={headerData.logo.image}
                alt={headerData.logo.text || 'Logo'}
                className="h-8 md:h-10"
              />
            ) : (
              <span className="text-2xl md:text-3xl font-bold text-blue-600">
                {headerData.logo.text}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {headerData.navigation.map((item) => (
              <NavigationDropdown key={item.id} item={item} />
            ))}
          </nav>

          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {headerData.cta && (
              <Link
                href={headerData.cta.href}
                className="hidden md:inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {headerData.cta.text}
              </Link>
            )}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
