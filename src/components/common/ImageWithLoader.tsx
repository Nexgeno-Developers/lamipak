'use client';

import Image from 'next/image';
import { useState } from 'react';

type ImageWithLoaderProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
};

/**
 * Same loading UX as {@link InsightCard}: gradient shell, spinner, fade-in when ready.
 */
export function ImageWithLoader({
  src,
  alt,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  loading = 'lazy',
}: ImageWithLoaderProps) {
  const trimmed = src?.trim();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const showImage = Boolean(trimmed) && !isError;

  if (!showImage) {
    return (
      <div
        className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-[#B7D7EA]/40 to-[#009FE8]/20"
        aria-hidden
      />
    );
  }

  return (
    <>
      <div
        className={`absolute inset-0 rounded-[inherit] bg-gradient-to-br from-[#F5FAFF] to-[#D7EEF9] transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden
      />
      {!isLoaded ? (
        <div className="absolute inset-0 z-[1] flex items-center justify-center">
          <span className="h-10 w-10 rounded-full border-4 border-[#E5F2FA] border-t-[#009FE8] animate-spin" />
        </div>
      ) : null}
      <Image
        src={trimmed as string}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        className={`relative z-[2] transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        sizes={sizes}
        priority={priority}
        loading={loading}
      />
    </>
  );
}
