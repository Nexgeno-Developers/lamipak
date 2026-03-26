import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCanonicalUrl } from '@/config/site';
import { PageBuilder } from '@/components/pageBuilder/PageBuilder';
import { getProductDetailPage } from '@/fake-api/page-builder';

const MAIN_CATEGORY = 'packaging' as const;
const BASE_PATH = '/aseptic-pakaging-solutions';

interface ProductDetailRouteProps {
  params: Promise<{
    subCategory: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailRouteProps): Promise<Metadata> {
  const { subCategory, slug } = await params;
  const page = await getProductDetailPage(MAIN_CATEGORY, subCategory, slug);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: page.seo?.meta_title || page.title,
    description: page.seo?.meta_description,
    alternates: {
      canonical: getCanonicalUrl(`${BASE_PATH}/${subCategory}/${slug}`),
    },
  };
}

export default async function AsepticPackagingSolutionsProductDetailRoute({ params }: ProductDetailRouteProps) {
  const { subCategory, slug } = await params;
  const page = await getProductDetailPage(MAIN_CATEGORY, subCategory, slug);
  if (!page) notFound();

  return (
    <PageBuilder
      pageData={page}
      pageContext={{
        mainCategory: MAIN_CATEGORY,
        subCategory,
      }}
    />
  );
}

