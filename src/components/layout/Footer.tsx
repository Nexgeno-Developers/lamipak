import Link from 'next/link';
import { fetchFooterData } from '@/lib/api';

/**
 * Footer Component
 * 
 * Server Component that fetches footer data from API
 */
export default async function Footer() {
  const footerData = await fetchFooterData();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Footer Columns */}
          {footerData.columns.map((column) => (
            <div key={column.id}>
              <h3 className="text-white font-semibold mb-4 text-lg">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        {footerData.socialLinks && footerData.socialLinks.length > 0 && (
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="flex items-center justify-center space-x-6">
              {footerData.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.platform}
                >
                  {social.icon ? (
                    <span className="text-2xl">{social.icon}</span>
                  ) : (
                    <span className="text-sm font-medium">{social.platform}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">{footerData.copyright}</p>
            {footerData.additionalLinks && footerData.additionalLinks.length > 0 && (
              <div className="flex space-x-6">
                {footerData.additionalLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
