'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';

export interface MarketingNewsItem {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  date: string;
  time: string;
}

interface LatestNewsClientProps {
  items: MarketingNewsItem[];
}

export default function LatestNewsClient({ items }: LatestNewsClientProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!items || items.length === 0) {
    return null;
  }

  const shouldLoop = items.length > 3;

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0E233C]">
            Latest <span className="text-[#009FE8]">News</span>
          </h2>
        </div>

        {/* Tabs (visual only) */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-8 border-b border-gray-200">
            <button
              type="button"
              className="pb-3 text-sm md:text-base font-semibold text-[#009FE8] border-b-2 border-[#009FE8]"
            >
              Trend &amp; Insight
            </button>
            <button
              type="button"
              className="pb-3 text-sm md:text-base font-semibold text-gray-500 hover:text-[#009FE8] transition-colors"
            >
              Press Release &amp; Event
            </button>
          </div>
        </div>

        {/* Slider */}
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          slidesPerGroup={1}
          loop={shouldLoop}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
              slidesPerGroup: 1,
              spaceBetween: 24,
            },
          }}
          speed={500}
          pagination={{
            clickable: true,
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <article className="bg-white rounded-[32px] shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden flex flex-col h-full">
                <div className="relative w-full pt-[70%] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="px-6 pt-5 pb-6 flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-semibold text-[#0E233C] mb-4 leading-snug">
                    {item.title}
                  </h3>

                  <div className="mt-auto flex items-center justify-between text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#009FE8]" />
                      <span>{item.time}</span>
                    </div>
                    <span>{item.date}</span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

