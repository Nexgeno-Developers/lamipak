'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { InsightItem } from '@/lib/api/insights_layout';

export type InsightCardVariant = 'articles' | 'webinar' | 'newsletter';

const shellByVariant: Record<InsightCardVariant, string> = {
  articles: 'bg-[#E5F2FA] border border-[#B7D7EA]/35',
  webinar: 'bg-white shadow-sm border border-black/5',
  newsletter: 'bg-[#E5F2FA] border border-[#B7D7EA]/35',
};

function formatCardTime(value?: string): string | undefined {
  const raw = (value ?? '').trim();
  if (!raw) return undefined;

  // If API already returns a human label (e.g. "10:00 AM"), keep it.
  if (/[ap]\.?m\.?/i.test(raw)) return raw.replace(/\s+/g, ' ').trim();

  const match = raw.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?$/);
  if (!match) return raw;

  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? '00');
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return raw;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return raw;

  const suffix = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const mm = String(minutes).padStart(2, '0');
  return `${h12}:${mm} ${suffix}`;
}

function formatCardDate(value?: string): string | undefined {
  const raw = (value ?? '').trim();
  if (!raw) return undefined;

  // Prefer stable parsing for YYYY-MM-DD to avoid timezone shifts.
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      const dt = new Date(Date.UTC(year, month - 1, day));
      if (!Number.isNaN(dt.getTime())) {
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }).format(dt);
      }
    }
  }

  const dt = new Date(raw);
  if (Number.isNaN(dt.getTime())) return raw;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dt);
}

export function InsightCard({
  item,
  variant,
}: {
  item: InsightItem;
  variant: InsightCardVariant;
}) {
  const shell = shellByVariant[variant];
  const imageSrc = item.image?.trim();
  const metaDate = formatCardDate(item.date);
  const metaTime = formatCardTime(item.time);
  const hasMeta = Boolean(metaDate || metaTime);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const showImage = Boolean(imageSrc) && !isError;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[50px] bg-white p-4 md:p-5 h-full`}
    >
      <div className="relative w-full overflow-hidden rounded-[50px] bg-gray-100">
        {showImage ? (
          <>
            <div
              className={`absolute inset-0 rounded-[50px] bg-gradient-to-br from-[#F5FAFF] to-[#D7EEF9] transition-opacity duration-500 ${
                isLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden
            />
            {!isLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="h-10 w-10 rounded-full border-4 border-[#E5F2FA] border-t-[#009FE8] animate-spin" />
              </div>
            ) : null}
            <Image
              src={imageSrc as string}
              alt={item.imageAlt}
              height={1000}
              width={1000}
              onLoadingComplete={() => setIsLoaded(true)}
              onError={() => setIsError(true)}
              className={`h-[250px] w-full rounded-[50px] object-cover object-top transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              loading="lazy"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#B7D7EA]/40 to-[#009FE8]/20" />
        )}
      </div>

      {hasMeta ? (
        <div className="mt-4 rounded-[32px] px-5 py-3">
          <div className="flex items-center justify-between gap-4 text-xs text-[#7A7A7A] md:text-sm">
            {metaTime ? (
              <div className="inline-flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path
                    d="M12 6v6l3 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                </svg>
                <span className="font-medium">{metaTime}</span>
              </div>
            ) : (
              <span aria-hidden />
            )}

            {metaDate ? (
              <div className="inline-flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M4 9h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M9 4v3M15 4v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="font-medium">{metaDate}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={`flex flex-1 flex-col pb-4 px-3 ${hasMeta ? 'mt-4 pt-1' : 'mt-4 pt-4'}`}>
        <h3
          className="text-base md:text-[20px] font-bold text-[#009FE8] leading-snug line-clamp-2"
          dangerouslySetInnerHTML={{ __html: item.title }}
        />
        <p
          className="mt-2 text-sm md:text-[15px] text-black leading-relaxed flex-1 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
        <div className="mt-2 pt-1">
          <Link
            href={item.href}
            className="text-sm md:text-[15px] capitalize font-bold text-black hover:text-[#009FE8] transition-colors inline-flex items-center gap-1"
          >
            Read more
           
          </Link>
        </div>
      </div>
    </article>
  );
}
