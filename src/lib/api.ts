/**
 * Central API Helper
 * 
 * This module provides a centralized way to interact with the API.
 * Currently uses fake API functions, but can be easily switched to
 * real API calls when the Laravel backend is ready.
 */

import { API_CONFIG } from '@/config/api';
import { getHomepageData as fakeGetHomepageData, type HomepageData } from '@/fake-api/homepage';
import { getPageData as fakeGetPageData, type PageData } from '@/fake-api/pages';
import { getHeaderData as fakeGetHeaderData, type HeaderData } from '@/fake-api/layout';
import { getFooterData as fakeGetFooterData, type FooterData } from '@/fake-api/layout';

/**
 * Checks if we should use the real API or fake API
 */
const useRealAPI = (): boolean => {
  return Boolean(API_CONFIG.baseUrl);
};

/**
 * Fetches homepage data
 * 
 * @returns Promise<HomepageData>
 */
export async function fetchHomepageData(): Promise<HomepageData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.homepage}`);
    // if (!response.ok) throw new Error('Failed to fetch homepage data');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetHomepageData();
}

/**
 * Fetches page data by slug
 * 
 * @param slug - The page slug
 * @returns Promise<PageData | null>
 */
export async function fetchPageData(slug: string): Promise<PageData | null> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.page(slug)}`);
    // if (!response.ok) {
    //   if (response.status === 404) return null;
    //   throw new Error('Failed to fetch page data');
    // }
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetPageData(slug);
}

/**
 * Fetches header data
 * 
 * @returns Promise<HeaderData>
 */
export async function fetchHeaderData(): Promise<HeaderData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.header}`);
    // if (!response.ok) throw new Error('Failed to fetch header data');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetHeaderData();
}

/**
 * Fetches footer data
 * 
 * @returns Promise<FooterData>
 */
export async function fetchFooterData(): Promise<FooterData> {
  if (useRealAPI()) {
    // TODO: Replace with real API call when Laravel backend is ready
    // const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.footer}`);
    // if (!response.ok) throw new Error('Failed to fetch footer data');
    // return response.json();
    throw new Error('Real API not yet implemented');
  }
  
  return fakeGetFooterData();
}
