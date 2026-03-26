import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getCanonicalUrl } from '@/config/site';
import { PageBuilder } from '@/components/pageBuilder/PageBuilder';
import { getSubCategoryPage } from '@/fake-api/page-builder';

const MAIN_CATEGORY = 'packaging' as const;
const BASE_PATH = '/aseptic-pakaging-solutions';

interface SubCategoryPageProps {
  params: Promise<{
    subCategory: string;
  }>;
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { subCategory } = await params;
  const page = await getSubCategoryPage(MAIN_CATEGORY, subCategory);

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
      canonical: getCanonicalUrl(`${BASE_PATH}/${subCategory}`),
    },
  };
}

export default async function AsepticPackagingSolutionsSubCategoryRoute({ params }: SubCategoryPageProps) {
  const { subCategory } = await params;
  const page = await getSubCategoryPage(MAIN_CATEGORY, subCategory);
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

