/**
 * Fake API for Layout Data (Header & Footer)
 * 
 * This file contains mock data for header and footer.
 * When the Laravel API is ready, replace the implementation
 * with actual fetch calls to the API_CONFIG endpoints.
 */

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface HeaderData {
  logo: {
    text?: string;
    image?: string;
    href: string;
  };
  navigation: NavigationItem[];
  cta?: {
    text: string;
    href: string;
  };
}

export interface FooterColumn {
  id: string;
  title: string;
  links: Array<{
    id: string;
    label: string;
    href: string;
  }>;
}

export interface SocialLink {
  id: string;
  platform: string;
  href: string;
  icon?: string;
}

export interface FooterData {
  columns: FooterColumn[];
  socialLinks?: SocialLink[];
  copyright: string;
  additionalLinks?: Array<{
    id: string;
    label: string;
    href: string;
  }>;
}

/**
 * Fetches header data
 * 
 * @returns Promise<HeaderData> - Header data
 */
export async function getHeaderData(): Promise<HeaderData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock data - in real implementation, this would fetch from API
  return {
    logo: {
      text: 'LAMIPAK',
      image: '/logo.png',
      href: '/',
    },
    navigation: [
      {
        id: '1',
        label: 'SOLUTIONS',
        href: '/solutions',
      },
      {
        id: '2',
        label: 'INDUSTRIES',
        href: '/industries',
      },
      {
        id: '3',
        label: 'SUSTAINABILITY',
        href: '/sustainability',
      },
      {
        id: '4',
        label: 'INSIGHTS',
        href: '/insights',
      },
      {
        id: '5',
        label: 'ABOUT',
        href: '/about',
      },
    ],
    cta: {
      text: 'CONTACT',
      href: '/contact',
    },
  };
}

/**
 * Fetches footer data
 * 
 * @returns Promise<FooterData> - Footer data
 */
export async function getFooterData(): Promise<FooterData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock data - in real implementation, this would fetch from API
  return {
    columns: [
      {
        id: '1',
        title: 'Company',
        links: [
          { id: '1', label: 'About Us', href: '/about' },
          { id: '2', label: 'Services', href: '/services' },
          { id: '3', label: 'Contact', href: '/contact' },
        ],
      },
      {
        id: '2',
        title: 'Resources',
        links: [
          { id: '4', label: 'Documentation', href: '/docs' },
          { id: '5', label: 'Support', href: '/support' },
          { id: '6', label: 'Blog', href: '/blog' },
        ],
      },
      {
        id: '3',
        title: 'Legal',
        links: [
          { id: '7', label: 'Privacy Policy', href: '/privacy' },
          { id: '8', label: 'Terms of Service', href: '/terms' },
          { id: '9', label: 'Cookie Policy', href: '/cookies' },
        ],
      },
    ],
    socialLinks: [
      {
        id: '1',
        platform: 'Facebook',
        href: 'https://facebook.com',
      },
      {
        id: '2',
        platform: 'Twitter',
        href: 'https://twitter.com',
      },
      {
        id: '3',
        platform: 'LinkedIn',
        href: 'https://linkedin.com',
      },
      {
        id: '4',
        platform: 'Instagram',
        href: 'https://instagram.com',
      },
    ],
    copyright: `© ${new Date().getFullYear()} Lamipak. All rights reserved.`,
    additionalLinks: [
      { id: '1', label: 'Sitemap', href: '/sitemap' },
    ],
  };
}
