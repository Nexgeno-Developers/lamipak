import type { VideoBannerData } from '@/lib/api/home';

/** Fallback video banner data for NPD routes (`/npd`, `/npd1`, …) — merged with CMS `video_url` in the layout page. */
export const NPD_STATIC_VIDEO_BANNER: VideoBannerData = {
  title: '',
  preTitle: '',
  preDescription: '',
  videoUrl: 'https://www.youtube.com/watch?v=2Tpppx-X0z0',
  ctaText: '',
  ctaLink: '',
};
