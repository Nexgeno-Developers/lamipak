import Link from 'next/link';
import type { CompanyNavigation as CompanyNavigationType } from '@/fake-api/company';

interface CompanyNavigationProps {
  data: CompanyNavigationType;
  activePath?: string;
}

/**
 * Company Navigation Component (Server Component)
 * 
 * Displays circular icon cards with labels in a horizontal row.
 * Each card is clickable and links to a specific page.
 * Highlights the active item based on the current pathname.
 */
export default function CompanyNavigation({ data, activePath }: CompanyNavigationProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'info':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        );
      case 'globe':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        );
      case 'building':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7V3H2v18h20V7H12zm-2 12H4v-2h6v2zm0-4H4v-2h6v2zm0-4H4V9h6v2zm8 8h-6v-2h6v2zm0-4h-6v-2h6v2zm0-4h-6V9h6v2z"/>
          </svg>
        );
      case 'document':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        );
      case 'heart':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10">
          {data.items.map((item) => {
            // Check if current path matches item href, or if on /about-us and item is "About us" (/our-company)
            const isActive = activePath === item.href || 
              (activePath === '/about-us' && item.href === '/our-company') ||
              (activePath === '/our-company' && item.href === '/our-company');
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex flex-col items-center group transition-transform hover:scale-105"
              >
                {/* Circular Icon Container */}
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-3 transition-colors ${
                  isActive
                    ? 'bg-[#009FE8] border-2 border-[#009FE8] shadow-md'
                    : 'bg-gray-50 border border-gray-200 group-hover:bg-gray-100'
                }`}>
                  <div className={isActive ? 'text-white' : 'text-[#009FE8]'}>
                    {getIcon(item.icon)}
                  </div>
                </div>
                
                {/* Label */}
                <span className={`text-sm md:text-base font-medium text-center transition-colors ${
                  isActive ? 'text-[#009FE8] font-semibold' : 'text-gray-900'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
