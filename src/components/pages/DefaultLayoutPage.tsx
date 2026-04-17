import Breadcrumbs from '@/components/common/Breadcrumbs';
import { RichText } from '@/components/common/RichText';
import CompanyHero from '@/components/company/CompanyHero';
import { plainTextFromMaybeHtml } from '@/lib/htmlText';

export type DefaultLayoutPageData = {
  slug: string;
  title: string;
  content: string;
  /** From CMS `meta.banner_images.url` when present. */
  heroBackgroundImage?: string;
};

/**
 * Generic CMS page when API `layout` is `default`.
 * Renders hero + breadcrumbs + rich text body from the text editor (`content` HTML).
 */
export default function DefaultLayoutPage({ data }: { data: DefaultLayoutPageData }) {
  const breadcrumbLabel = plainTextFromMaybeHtml(data.title).trim() || 'Page';

  return (
    <main className="min-h-screen bg-gray-50">
      <CompanyHero
        data={{
          title: data.title,
          backgroundImage: data.heroBackgroundImage?.trim() || '/about_banner.jpg',
        }}
      />

      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
        </div>
      </section>

      <section className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <RichText
            as="div"
            html={data.content}
            className="text-base leading-relaxed text-black md:text-lg [&_a]:text-[#009FE8] [&_a]:underline [&_strong]:font-semibold"
          />
        </div>
      </section>
    </main>
  );
}
