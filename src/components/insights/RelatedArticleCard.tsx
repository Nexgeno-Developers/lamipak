import Image from 'next/image';
import Link from 'next/link';
import type { RelatedArticleItem } from '@/lib/api/insights_article_detail_layout';

export function RelatedArticleCard({ item }: { item: RelatedArticleItem }) {
  return (
    <article className="overflow-hidden rounded-[50px] bg-white p-4">
      <div className="relative w-full overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt}
            height={1000}
            width={1000}
            className="object-cover rounded-[50px] h-[220px] object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#B7D7EA]/50 to-[#009FE8]/15" />
        )}
      </div>
      <div className="pt-5 pb-3 px-3">
        {item.category ? (
          <p className="text-xs font-bold uppercase tracking-wide text-black">{item.category}</p>
        ) : null}
        <h3
          className="text-base md:text-[20px] font-bold text-[#009FE8] leading-snug line-clamp-2"
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
        <p
          className="mt-2 text-sm md:text-[15px] text-black leading-relaxed flex-1 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: item.excerpt }}
        />
        <Link
          href={item.href}
          className="mt-2 text-sm md:text-[15px] capitalize font-bold text-black hover:text-[#009FE8] transition-colors inline-flex items-center gap-1"
        >
          Read more
         
        </Link>
      </div>
    </article>
  );
}
