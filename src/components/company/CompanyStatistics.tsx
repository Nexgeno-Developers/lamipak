'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { CompanyStatistic } from '@/fake-api/company';

interface CompanyStatisticsProps {
  statistics: CompanyStatistic[];
}

/**
 * Company Statistics Component (Client Component)
 * 
 * Displays 6 statistics cards with animated counters.
 * Cards are arranged in a 2x3 grid on desktop, stacked on mobile.
 */
export default function CompanyStatistics({ statistics }: CompanyStatisticsProps) {
  const [counters, setCounters] = useState<Record<string, number | string>>({});
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if element is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            startCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('company-statistics');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasAnimated]);

  const startCounters = () => {
    statistics.forEach((stat) => {
      const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
      if (isNaN(numericValue)) {
        // For non-numeric values, set immediately
        setCounters((prev) => ({
          ...prev,
          [stat.id]: stat.value,
        }));
        return;
      }

      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      let stepCount = 0;

      const timer = setInterval(() => {
        stepCount++;
        current += increment;
        
        if (current >= numericValue || stepCount >= steps) {
          current = numericValue;
          clearInterval(timer);
        }

        setCounters((prev) => ({
          ...prev,
          [stat.id]: Math.floor(current),
        }));
      }, duration / steps);
    });
  };

  const formatValue = (stat: CompanyStatistic): string => {
    if (hasAnimated && counters[stat.id] !== undefined) {
      const value = counters[stat.id];
      // Preserve the original format (e.g., "1900+", "8%")
      if (stat.value.includes('+')) {
        return `${value}+`;
      }
      if (stat.value.includes('%')) {
        return `${value}%`;
      }
      return value.toString();
    }
    // Show initial value (0 or the actual number without suffix)
    const numericValue = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numericValue)) {
      if (stat.value.includes('+')) {
        return '0+';
      }
      if (stat.value.includes('%')) {
        return '0%';
      }
      return '0';
    }
    return stat.value;
  };

  return (
    <section id="company-statistics" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {statistics.map((stat) => (
            <div
              key={stat.id}
              className="bg-[#EDF0F1] rounded-[50px] p-8 md:p-10  duration-300 flex flex-col text-start"
            >
              {/* Icon */}
              <div className="mb-6 w-12 h-12 flex items-center justify-start">
                {stat.icon ? (
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-16 h-16 bg-[#009FE8] rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="mb-4">
                <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#000]">
                  {formatValue(stat)}
                </span>
              </div>

              {/* Label */}
              <div>
                <p className="text-lg md:text-xl text-black font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
