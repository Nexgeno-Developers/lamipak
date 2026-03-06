/**
 * Fake API for Homepage Data
 * 
 * This file contains mock data for the homepage.
 * When the Laravel API is ready, replace the implementation
 * with actual fetch calls to the API_CONFIG endpoints.
 */

export interface HeroSlide {
  id: string;
  category: string;
  title: string;
  titleHighlight: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export interface Hero {
  slides: HeroSlide[];
  categories: Array<{
    id: string;
    label: string;
    href: string;
    slideIndex: number; // Index of the slide this category corresponds to
  }>;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

export interface HomepageSEO {
  meta_title: string;
  meta_description: string;
  canonical_url?: string;
  schema?: {
    '@context': string;
    '@type': string;
    headline?: string;
    description?: string;
    url?: string;
    [key: string]: unknown;
  };
}

export interface HomepageData {
  hero: Hero;
  services: Service[];
  products: Product[];
  testimonials: Testimonial[];
  seo?: HomepageSEO;
}

/**
 * Fetches all homepage data in a single request
 * 
 * @returns Promise<HomepageData> - All homepage sections
 */
export async function getHomepageData(): Promise<HomepageData> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Mock data
  return {
    hero: {
      slides: [
        {
          id: '1',
          category: 'ASEPTIC PACKAGING ENGINEERING',
          title: 'IN A STERILE WORLD,',
          titleHighlight: 'PRECISION STILL WINS.',
          ctaText: 'EXPLORE SOLUTIONS',
          ctaLink: '/solutions',
          backgroundImage: '/banner-slider1.jpg',
        },
        {
          id: '2',
          category: 'INNOVATION IN PACKAGING',
          title: 'ADVANCED TECHNOLOGY,',
          titleHighlight: 'SUSTAINABLE FUTURE.',
          ctaText: 'DISCOVER MORE',
          ctaLink: '/solutions',
          backgroundImage: '/banner-slider2.jpg',
        },
        {
          id: '3',
          category: 'INDUSTRIAL EXCELLENCE',
          title: 'WHERE QUALITY MEETS,',
          titleHighlight: 'PERFECTION.',
          ctaText: 'LEARN MORE',
          ctaLink: '/solutions',
          backgroundImage: '/banner-slider3.jpg',
        },
        {
          id: '4',
          category: 'GLOBAL LEADERSHIP',
          title: 'WORLDWIDE EXPERTISE,',
          titleHighlight: 'LOCAL SOLUTIONS.',
          ctaText: 'GET STARTED',
          ctaLink: '/contact',
          backgroundImage: '/banner-slider4.jpg',
        },
        {
          id: '5',
          category: 'CUTTING-EDGE SOLUTIONS',
          title: 'NEXT GENERATION,',
          titleHighlight: 'PACKAGING TECHNOLOGY.',
          ctaText: 'EXPLORE NOW',
          ctaLink: '/solutions',
          backgroundImage: '/banner-slider5.jpg',
        },
      ],
      categories: [
        {
          id: '1',
          label: 'DAIRY SYSTEMS',
          href: '/solutions/dairy',
          slideIndex: 0, // First slide
        },
        {
          id: '2',
          label: 'PLANT-BASED BEVERAGES',
          href: '/solutions/plant-based',
          slideIndex: 1, // Second slide
        },
        {
          id: '3',
          label: 'LIQUID FOODS',
          href: '/solutions/liquid-foods',
          slideIndex: 2, // Third slide
        },
        {
          id: '4',
          label: 'NUTRITIONAL',
          href: '/solutions/nutritional',
          slideIndex: 3, // Fourth slide
        },
        {
          id: '5',
          label: 'PHARMA LIQUIDS',
          href: '/solutions/pharma',
          slideIndex: 4, // Fifth slide
        },
      ],
    },
    seo: {
      meta_title: 'Lamipak - Building the Future with Innovative Solutions1',
      meta_description: 'Welcome to our platform. Discover our services, products, and solutions for your business needs.',
      canonical_url: '/',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        headline: 'Welcome to Our Platform',
        description: 'Building the future with innovative solutions',
      },
    },
    services: [
      {
        id: '1',
        title: 'Web Development',
        description: 'Custom web applications built with modern technologies',
      },
      {
        id: '2',
        title: 'Mobile Apps',
        description: 'Native and cross-platform mobile solutions',
      },
      {
        id: '3',
        title: 'Cloud Services',
        description: 'Scalable cloud infrastructure and deployment',
      },
      {
        id: '4',
        title: 'Consulting',
        description: 'Expert guidance for your digital transformation',
      },
    ],
    products: [
      {
        id: '1',
        name: 'Enterprise Suite',
        description: 'Complete solution for large organizations',
        price: 9999,
      },
      {
        id: '2',
        name: 'Business Package',
        description: 'Perfect for growing businesses',
        price: 4999,
      },
      {
        id: '3',
        name: 'Starter Plan',
        description: 'Essential features for small teams',
        price: 999,
      },
    ],
    testimonials: [
      {
        id: '1',
        name: 'John Doe',
        role: 'CEO',
        company: 'Tech Corp',
        content: 'Outstanding service and support. Highly recommended!',
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'CTO',
        company: 'Innovate Inc',
        content: 'The best decision we made for our digital infrastructure.',
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'Founder',
        company: 'StartupXYZ',
        content: 'Exceeded our expectations in every way possible.',
      },
    ],
  };
}
