'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { ProductIndustriesFeaturedProduct } from '@/lib/api/product_industries_layout';

export default function IndustriesFeaturedCarousel({
  products,
}: {
  products: ProductIndustriesFeaturedProduct[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector('[data-carousel-card]') as HTMLElement | null;
    const w = first?.offsetWidth ?? 280;
    el.scrollBy({ left: dir * (w + 24), behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <div>
      <div className="flex justify-end gap-3 mb-6">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#009FE8] text-[#009FE8] transition hover:bg-[#009FE8] hover:text-white"
          aria-label="Previous products"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#009FE8] text-[#009FE8] transition hover:bg-[#009FE8] hover:text-white"
          aria-label="Next products"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory md:snap-none"
      >
        {products.map((p) => (
          <div
            key={p.id}
            data-carousel-card
            className="min-w-[260px] max-w-[280px] flex-shrink-0 snap-start md:min-w-[280px] md:max-w-[300px]"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-[#F4F4F4] shadow-sm transition hover:shadow-md">
              <div className="relative aspect-square w-full bg-white">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    className="object-contain p-6"
                    sizes="280px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200" />
                )}
              </div>
              <div className="flex flex-1 flex-col px-6 pb-8 pt-4 text-center">
                <h3 className="text-lg font-bold text-black md:text-xl">{p.title}</h3>
                {p.subtitle ? (
                  <p className="mt-1 text-sm text-black/80">{p.subtitle}</p>
                ) : null}
                <Link
                  href={p.href}
                  className="mt-4 inline-block text-sm font-semibold text-[#009FE8] hover:text-[#0077B6]"
                >
                  View product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
