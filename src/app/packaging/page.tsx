import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getMainCategoryPage } from '@/fake-api/page-builder';
import { getCanonicalUrl } from '@/config/site';
import { PageBuilder } from '@/components/pageBuilder/PageBuilder';

const MAIN_CATEGORY = 'packaging' as const;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getMainCategoryPage(MAIN_CATEGORY);
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  const canonicalUrl = page.seo?.canonical_path
    ? getCanonicalUrl(page.seo.canonical_path)
    : getCanonicalUrl(`/${MAIN_CATEGORY}`);

  return {
    title: page.seo?.meta_title || page.title,
    description: page.seo?.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function PackagingMainRoute() {
  const page = await getMainCategoryPage(MAIN_CATEGORY);
  if (!page) notFound();

  return (
    <PageBuilder
      pageData={page}
      pageContext={{
        mainCategory: MAIN_CATEGORY,
      }}
    />
  );
}
