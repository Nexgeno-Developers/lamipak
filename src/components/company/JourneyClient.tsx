'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { formatBoldText } from '@/lib/htmlText';
import type { JourneyData } from '@/fake-api/company';

interface JourneyClientProps {
  data: JourneyData;
}

/**
 * Journey Client Component
 *
 * Interactive timeline: desktop uses a vertical timeline; mobile uses a
 * horizontal snap-scrolling year strip (easier to scan and tap).
 */
export default function JourneyClient({ data }: JourneyClientProps) {
  const [selectedYear, setSelectedYear] = useState<string>(data.milestones[0]?.year || '');
  const yearChipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const selectedMilestone = data.milestones.find((m) => m.year === selectedYear) || data.milestones[0];

  useEffect(() => {
    const el = yearChipRefs.current.get(selectedYear);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [selectedYear]);

  if (!selectedMilestone) {
    return null;
  }

  const splitYear = (year: string) => {
    if (year.length === 4) {
      return { first: year.substring(0, 2), second: year.substring(2) };
    }
    return { first: year, second: '' };
  };

  const yearParts = splitYear(selectedYear);

  return (
    <section className="py-10 md:pt-10 md:pb-20 lg:pb-[120px] bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2
            className="text-[24px] md:text-4xl lg:text-5xl font-bold text-black"
            dangerouslySetInnerHTML={{ __html: formatBoldText(data.title) }}
          />
        </div>

        {/* Mobile: horizontal year strip — compact, thumb-friendly */}
        <div className="lg:hidden mb-6">
          <div
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:thin] [scrollbar-color:#009FE8_transparent] snap-x snap-mandatory scroll-pl-4 scroll-pr-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
            role="tablist"
            aria-label="Select year"
          >
            {data.milestones.map((milestone) => {
              const isSelected = milestone.year === selectedYear;
              return (
                <button
                  key={milestone.year}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  ref={(el) => {
                    if (el) yearChipRefs.current.set(milestone.year, el);
                    else yearChipRefs.current.delete(milestone.year);
                  }}
                  onClick={() => setSelectedYear(milestone.year)}
                  className={`snap-center flex-shrink-0 min-h-[40px] min-w-[4.25rem] rounded-full px-4 py-2.5 text-center text-[15px] font-bold transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#009FE8] text-white shadow-md ring-2 ring-[#009FE8] ring-offset-2 ring-offset-gray-50'
                      : 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:border-[#009FE8]/50'
                  }`}
                >
                  {milestone.year}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-xs text-gray-500 lg:hidden">Swipe for more years</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6 lg:gap-12 items-start">
          {/* Desktop: vertical timeline */}
          <div className="hidden lg:flex flex-col">
            <div className="flex items-start gap-4 lg:gap-6 w-full">
              <div className="relative flex-shrink-0 self-stretch">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#009FE8]" />
              </div>

              <div className="flex flex-col gap-2 md:gap-8 flex-1 relative">
                {data.milestones.map((milestone) => {
                  const isSelected = milestone.year === selectedYear;
                  return (
                    <div key={milestone.year} className="relative flex items-center">
                      <div className="absolute -left-6 md:-left-7 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div
                          className={`w-4 h-4 rounded-full transition-all ${
                            isSelected
                              ? 'bg-[#009FE8] border-3 border-white shadow-md'
                              : 'bg-transparent'
                          }`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedYear(milestone.year)}
                        className={`cursor-pointer text-left transition-colors flex items-center ${
                          isSelected
                            ? 'text-[#009FE8] font-semibold'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        <span className="text-base md:text-lg lg:text-[24px] font-bold leading-tight">
                          {milestone.year}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="hidden lg:flex flex-col items-start justify-start flex-shrink-0 absolute ml-[220px]">
                <div className="text-[#009FE8] font-bold leading-none">
                  <div className="text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]">{yearParts.first}</div>
                  <div className="text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] ml-[70px]">{yearParts.second}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full">
            <div className="relative rounded-[28px] md:rounded-[50px]">
              {selectedMilestone.image ? (
                <div className="relative w-full">
                  <Image
                    src={selectedMilestone.image}
                    alt={selectedMilestone.imageAlt}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover transition-opacity duration-300 rounded-[28px] md:rounded-[50px]"
                    priority={selectedYear === data.milestones[0]?.year}
                  />
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-[-30px] md:left-6 md:right-6">
                    <div className="bg-gray-100 bg-opacity-90 backdrop-blur-sm rounded-[15px] text-center p-3 md:p-5 w-[88%] md:w-[70%] mx-auto">
                      <p className="text-black text-[14px] md:text-lg font-medium">
                        {selectedMilestone.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-auto bg-gray-200 rounded-[50px]" style={{ aspectRatio: '4/3' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
