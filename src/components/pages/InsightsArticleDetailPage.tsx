import Breadcrumbs from '@/components/common/Breadcrumbs';
import { RichText } from '@/components/common/RichText';
import { InsightsPageHero } from '@/components/insights/InsightsPageHero';
import { RelatedArticleCard } from '@/components/insights/RelatedArticleCard';
import type { InsightsArticleDetailPageData } from '@/lib/api/insights_article_detail_layout';
import Image from 'next/image';
function buildHeroTitleHtml(data: InsightsArticleDetailPageData): string {
  if (!data.titleAccent) return data.titleMain;
  return `${data.titleMain} <span class="text-[#9fdbff]">${data.titleAccent}</span>`;
}

export default function InsightsArticleDetailPage({ data }: { data: InsightsArticleDetailPageData }) {
  const heroTitleHtml = buildHeroTitleHtml(data);

  return (
    <main className="min-h-screen bg-[#f5f7f8]">
      <InsightsPageHero
        titleHtml={heroTitleHtml}
        backgroundImage={data.heroImage}
        titleTag="div"
      />

      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs
            items={[
              { label: 'Insights', href: '/insights' },
              { label: 'Articles', href: '/insights/articles' },
              { label: data.breadcrumbLabel },
            ]}
          />
        </div>
      </section>

<div className="bg-gray-50 lg:py-24 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <article className="lg:col-span-9">
            <div className="rounded-[50px] bg-white p-5 md:p-8 lg:p-10">
              <header className="mb-8">
                <h1 className="text-2xl font-bold leading-tight text-black md:text-3xl lg:text-5xl">
                  <span dangerouslySetInnerHTML={{ __html: data.titleMain }} />
                  {data.titleAccent ? (
                    <>
                      {' '}
                      <span className="text-[#009FE8]" dangerouslySetInnerHTML={{ __html: data.titleAccent }} />
                    </>
                  ) : null}
                </h1>
              </header>

              {data.heroImage ? (
                <div className="relative mb-8 w-full overflow-hidden ">
                  {/* eslint-disable-next-line @next/next/no-img-element -- CMS URLs */}
                  <Image
                    src={data.heroImage}
                    alt=""
                    height={1000}
                    width={1000}
                    className="h-full w-full object-cover rounded-[50px]"
                  />
                </div>
              ) : null}

              <RichText
                html={data.bodyHtml}
                className="prose prose-lg max-w-none text-gray-800 prose-headings:font-bold prose-headings:text-black prose-p:leading-relaxed prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 leading-[30px]"
              />
            </div>
          </article>

          <aside className="lg:col-span-3">
            <div className="sticky top-6 space-y-4">
              <h2 className="text-lg font-bold text-black">Related articles</h2>
              <div className="space-y-4">
                {data.relatedArticles.map((item) => (
                  <RelatedArticleCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      </div>
    </main>
  );
}
