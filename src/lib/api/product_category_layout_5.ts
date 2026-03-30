type ProductCategoryLayout3ApiResponse = {
  data?: {
    slug: string;
    title: string;
    layout?: string;
    meta?: {
      banner_images?: { url?: string };
      short_summary_description?: string;
      hero_title?: string;
      hero_subtitle?: string;
      hero_description?: string;
    };
    seo?: {
      title?: string;
      description?: string;
      keywords?: string;
      schema?: string;
      canonical_url?: string;
      robots_index?: string;
      robots_follow?: string;
      og_title?: string;
      og_description?: string;
      og_image?: { url?: string };
      twitter_title?: string;
      twitter_description?: string;
      twitter_image?: { url?: string };
    };
  };
};

function stripHtml(value?: string) {
  if (!value) return '';
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildPageApiPath(slug: string) {
  return slug
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/');
}

export async function fetcProductCategoryLayout5Page(slug: string) {
  const baseUrl = process.env.COMPANY_API_BASE_URL;
  if (!baseUrl) return null;

  try {
    const apiSlugPath = buildPageApiPath(slug);
    const res = await fetch(
      `${baseUrl}/v1/page/${apiSlugPath}?autofetch=product_categories`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;

    const { data } = (await res.json()) as ProductCategoryLayout3ApiResponse;
    if (!data || data.layout !== 'product_category_detail_5') return null;

    const heroTitle = data.meta?.hero_title || data.title;
    const heroSubtitle = data.meta?.hero_subtitle || '';
    const heroDescription = stripHtml(data.meta?.hero_description);
    const featureDescription = data.meta?.short_summary_description || heroSubtitle;

    return {
      slug: data.slug,
      title: data.title,
      meta: data.meta || {},
      seo: data.seo || {},
      pageData: {
        slug: data.slug,
        title: data.title,
        sections: [
          {
            type: 'heroWithBreadcrumbs',
            data: {
              title: data.title,
              backgroundImage: data.meta?.banner_images?.url || undefined,
              breadcrumbs: [{ label: data.title }],
            },
          },
          {
            type: 'opticapLanding',
            data: {
              title: heroTitle,
              image: data.meta?.banner_images?.url || '/cap-solution_left-image.webp',
              descriptionLines: [heroDescription || heroSubtitle].filter(Boolean),
              sizeFormatTitle: 'Size Format',
              sizeFormatText: heroSubtitle,
              productFeaturesTitle: 'Product Features',
              productFeaturesPills: [],
              productFeaturesDescription: featureDescription || '',
            },
          },
        ],
      },
    };
  } catch {
    return null;
  }
}

