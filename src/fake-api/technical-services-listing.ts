/**
 * Fake API for Technical Services Listing Page Data
 * 
 * This file contains mock data for the technical services listing page.
 * When the Laravel API is ready, replace the implementation
 * with actual fetch calls to the API_CONFIG endpoints.
 */

/**
 * Technical Services Listing Page Data
 */
export interface TechnicalServicesListingData {
  heroTitle: string;
  heroBackgroundImage?: string;
  introSection: {
    heading: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
  };
}

/**
 * Gets technical services listing page data
 * 
 * @returns TechnicalServicesListingData
 */
export function getTechnicalServicesListingData(): TechnicalServicesListingData {
  return {
    heroTitle: 'Technical Service',
    heroBackgroundImage: '/technical_bg.jpg',
    introSection: {
      heading: 'Technical Support Service',
      paragraphs: [
        'As one of the leading aseptic packaging manufacturers, Lamipak delivers comprehensive Technical Support Services designed to maximize efficiency across the entire aseptic carton packaging and aseptic liquid packaging value chain.',
        'Beyond supplying aseptic packaging materials, Lamipak provides integrated technical expertise covering aseptic processing and packaging, production optimization, equipment performance, and operational reliability for modern food and beverages packaging industries. ',
        'Our technical service ecosystem supports customers throughout every stage from machine installation and start-up to long-term operational excellence ensuring stable production, improved line efficiency, and sustainable business growth.'
      ],
      image: '/technical_support_image.jpg',
      imageAlt: 'Technical Support Team'
    }
  };
}
