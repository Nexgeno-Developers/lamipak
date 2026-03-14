'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { OurValuesSection } from '@/fake-api/company';

interface OurValuesProps {
  data: OurValuesSection;
}

/**
 * Our Values Component (Client Component)
 * 
 * Displays a section with clickable value tabs on the left
 * and an image with caption on the right that changes based on selection.
 */
export default function OurValues({ data }: OurValuesProps) {
  const [selectedValueId, setSelectedValueId] = useState<string>(data.values[0]?.id || '');

  const selectedValue = data.values.find((v) => v.id === selectedValueId) || data.values[0];

  if (!selectedValue) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#009FE8] mb-4">
            {data.heading}
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            {data.description}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Values List */}
          <div className="flex flex-col">
            <div className="space-y-0 border-t border-gray-200">
              {data.values.map((value, index) => {
                const isSelected = value.id === selectedValueId;
                return (
                  <button
                    key={value.id}
                    onClick={() => setSelectedValueId(value.id)}
                    className={`w-full text-left py-4 px-0 border-b border-gray-200 transition-colors ${
                      isSelected
                        ? 'text-[#009FE8]'
                        : 'text-gray-900 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg md:text-xl font-medium">
                        {value.title}
                      </span>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-[#009FE8] flex-shrink-0 ml-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column - Image and Caption */}
          <div className="flex flex-col">
            {/* Image */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-4 shadow-lg">
              {selectedValue.image ? (
                <Image
                  src={selectedValue.image}
                  alt={selectedValue.imageAlt}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>

            {/* Caption */}
            <div className="bg-gray-100 rounded-lg p-4 md:p-6">
              <p className="text-sm md:text-base text-gray-900 leading-relaxed">
                {selectedValue.caption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
