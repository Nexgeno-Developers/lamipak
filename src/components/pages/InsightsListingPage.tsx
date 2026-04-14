import type { InsightsListingData } from '@/lib/api/insights_listing_layout';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CallToAction from '@/components/home/CallToAction';
import NewsletterSubscription from '@/components/home/NewsletterSubscription';
import { InsightCard } from '@/components/insights/InsightCard';
import { InsightsListingWithFilters } from '@/components/insights/InsightsListingWithFilters';
import { InsightsPageHero } from '@/components/insights/InsightsPageHero';
import Link from 'next/link';

function cardVariant(kind: InsightsListingData['kind']): 'articles' | 'webinar' | 'newsletter' {
  if (kind === 'webinars') return 'webinar';
  if (kind === 'newsletter') return 'newsletter';
  return 'articles';
}

type PageItem = number | 'ellipsis';

function buildPageItems(currentPage: number, lastPage: number): PageItem[] {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }

  const items: PageItem[] = [];
  const windowSize = 2;
  let start = Math.max(2, currentPage - windowSize);
  let end = Math.min(lastPage - 1, currentPage + windowSize);

  if (currentPage <= 4) {
    start = 2;
    end = 5;
  } else if (currentPage >= lastPage - 3) {
    start = lastPage - 4;
    end = lastPage - 1;
  }

  items.push(1);
  if (start > 2) items.push('ellipsis');
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < lastPage - 1) items.push('ellipsis');
  items.push(lastPage);

  return items;
}

export default function InsightsListingPage({ data }: { data: InsightsListingData }) {
  const variant = cardVariant(data.kind);
  const isArticles = data.kind === 'articles';
  const breadcrumbItems = [
    data.breadcrumbParentLabel
      ? {
          label: data.breadcrumbParentLabel,
          href: data.breadcrumbParentHref,
        }
      : { label: 'Insights', href: '/insights' },
    { label: data.breadcrumbLabel },
  ].filter(Boolean) as Array<{ label: string; href?: string }>;
  const pagination = data.pagination;
  const currentPage = pagination?.currentPage ?? 1;
  const lastPage = pagination?.lastPage ?? 1;
  const basePath = data.paginationPath || '';
  const hasPaginationLinks = Boolean(pagination && basePath);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < lastPage ? currentPage + 1 : null;
  const pageHref = (page: number) => (page <= 1 ? basePath : `${basePath}?page=${page}`);
  const pageItems = hasPaginationLinks && lastPage > 1 ? buildPageItems(currentPage, lastPage) : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <InsightsPageHero titleHtml={data.title} backgroundImage={data.heroBackgroundImage} />

      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          
          {isArticles ? (
            <InsightsListingWithFilters
              items={data.items}
              variant={variant}
              filterSubcategories={data.filterSubcategories}
              filterLinks={data.filterLinks}
              allFilterLabel={data.allFilterLabel}
              allFilterHref={data.allFilterHref}
              allFilterActive={data.allFilterActive}
            />
          ) : (
            data.items.length === 0 ? (
              <div className="rounded-xl bg-white p-10 text-center text-gray-600 shadow-sm ring-1 ring-black/5">
                No items available for this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                {data.items.map((item) => (
                  <InsightCard key={item.id} item={item} variant={variant} />
                ))}
              </div>
            )
          )}

          {hasPaginationLinks && pageItems.length > 0 ? (
            <div className="mt-10 flex items-center justify-center sm:justify-end">
              <nav
                aria-label="Pagination"
                className="flex flex-wrap items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-black/5"
              >
                {prevPage ? (
                  <Link
                    href={pageHref(prevPage)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B7D7EA] text-[#009FE8] transition-colors hover:bg-[#009FE8]/10"
                    aria-label="Previous page"
                  >
                    <span aria-hidden>‹</span>
                  </Link>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5F2FA] text-[#A8C7DA]">
                    <span aria-hidden>‹</span>
                  </span>
                )}

                {pageItems.map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-sm text-[#7A97A9]">
                      …
                    </span>
                  ) : (
                    <Link
                      key={item}
                      href={pageHref(item)}
                      aria-current={item === currentPage ? 'page' : undefined}
                      className={`flex h-9 min-w-[36px] items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors ${
                        item === currentPage
                          ? 'bg-[#009FE8] text-white'
                          : 'text-[#0E233C] hover:bg-[#E5F2FA]'
                      }`}
                    >
                      {item}
                    </Link>
                  ),
                )}

                {nextPage ? (
                  <Link
                    href={pageHref(nextPage)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B7D7EA] text-[#009FE8] transition-colors hover:bg-[#009FE8]/10"
                    aria-label="Next page"
                  >
                    <span aria-hidden>›</span>
                  </Link>
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5F2FA] text-[#A8C7DA]">
                    <span aria-hidden>›</span>
                  </span>
                )}
              </nav>
            </div>
          ) : null}
        </div>
      </section>

      <CallToAction />
      <NewsletterSubscription />
    </main>
  );
}
