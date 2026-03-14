/**
 * Company/About Us Page API Data
 * 
 * Mock data for the company/about us page.
 * This will be replaced with real API calls when the backend is ready.
 */

export interface CompanySEO {
  meta_title: string;
  meta_description: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: 'summary_large_image' | 'summary' | 'player' | 'app';
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema?: Record<string, unknown>;
}

export interface CompanyHero {
  title: string;
  backgroundImage: string;
}

export interface CompanyStatistic {
  id: string;
  icon: string; // Icon path or SVG
  value: string; // e.g., "1900+", "80+", "8%"
  label: string; // e.g., "Employees", "Coverage By Country"
}

export interface JourneyMilestone {
  year: string; // e.g., "2007", "2015"
  image: string; // Image path
  imageAlt: string; // Alt text for image
  caption: string; // Caption text displayed on image overlay
}

export interface JourneyData {
  title: string;
  titleHighlight: string; // Part of title to highlight (e.g., "LamiPak")
  milestones: JourneyMilestone[];
}

export interface CompanyData {
  hero: CompanyHero;
  statistics: CompanyStatistic[];
  journey: JourneyData;
  seo: CompanySEO;
}

/**
 * Get company/about us page data
 * 
 * @returns Promise<CompanyData>
 */
export async function getCompanyData(): Promise<CompanyData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    hero: {
      title: 'ABOUT US',
      backgroundImage: '/images/company/about-hero-bg.jpg', // You'll need to add this image
    },
    statistics: [
      {
        id: '1',
        icon: '/images/icons/employees.svg', // Two people icon
        value: '1900+',
        label: 'Employees',
      },
      {
        id: '2',
        icon: '/images/icons/globe.svg', // Globe icon
        value: '80+',
        label: 'Coverage By Country',
      },
      {
        id: '3',
        icon: '/images/icons/customers.svg', // Customers icon
        value: '340+',
        label: 'Customers',
      },
      {
        id: '4',
        icon: '/images/icons/growth.svg', // Growth arrow icon
        value: '8%',
        label: 'Annual Growth Rate',
      },
      {
        id: '5',
        icon: '/images/icons/sku.svg', // Document/paper icon
        value: '60+',
        label: 'Total SKU',
      },
      {
        id: '6',
        icon: '/images/icons/factory.svg', // Factory icon
        value: '2',
        label: 'Dual Factory Strength China + India',
      },
    ],
    journey: {
      title: 'LamiPak Journey',
      titleHighlight: 'LamiPak',
      milestones: [
        {
          year: '2007',
          image: '/images/company/journey/2007.jpg',
          imageAlt: 'LamiPak was established',
          caption: 'LamiPak was established',
        },
        {
          year: '2015',
          image: '/images/company/journey/2015.jpg',
          imageAlt: 'Major expansion milestone',
          caption: 'Major expansion milestone',
        },
        {
          year: '2018',
          image: '/images/company/journey/2018.jpg',
          imageAlt: 'International market entry',
          caption: 'International market entry',
        },
        {
          year: '2019',
          image: '/images/company/journey/2019.jpg',
          imageAlt: 'New product line launch',
          caption: 'New product line launch',
        },
        {
          year: '2020',
          image: '/images/company/journey/2020.jpg',
          imageAlt: 'Digital transformation initiative',
          caption: 'Digital transformation initiative',
        },
        {
          year: '2021',
          image: '/images/company/journey/2021.jpg',
          imageAlt: 'Sustainability commitment',
          caption: 'Sustainability commitment',
        },
        {
          year: '2022',
          image: '/images/company/journey/2022.jpg',
          imageAlt: 'Global expansion',
          caption: 'Global expansion',
        },
        {
          year: '2023',
          image: '/images/company/journey/2023.jpg',
          imageAlt: 'Innovation center opening',
          caption: 'Innovation center opening',
        },
        {
          year: '2024',
          image: '/images/company/journey/2024.jpg',
          imageAlt: 'Future vision',
          caption: 'Future vision',
        },
      ],
    },
    seo: {
      meta_title: 'About Us - Lamipak',
      meta_description: 'Learn about Lamipak, a leading company with 1900+ employees, serving 340+ customers across 80+ countries with innovative solutions.',
      canonical_url: '/our-company',
      og_title: 'About Us - Lamipak',
      og_description: 'Learn about Lamipak, a leading company with 1900+ employees, serving 340+ customers across 80+ countries with innovative solutions.',
      og_image: '/images/company/about-og.jpg',
      twitter_card: 'summary_large_image',
      twitter_title: 'About Us - Lamipak',
      twitter_description: 'Learn about Lamipak, a leading company with 1900+ employees, serving 340+ customers across 80+ countries with innovative solutions.',
      twitter_image: '/images/company/about-og.jpg',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Lamipak',
        description: 'A leading company with innovative solutions',
        url: 'https://lamipak.com',
      },
    },
  };
}
