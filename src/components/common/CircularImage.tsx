'use client';

import { useState } from 'react';
import Image from 'next/image';

type CircularImageProps = {
  src?: string | null;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  spinnerClassName?: string;
  fallbackClassName?: string;
  priority?: boolean;
};

export default function CircularImage({
  src,
  alt,
  fill,
  width,
  height,
  sizes,
  className,
  spinnerClassName,
  fallbackClassName,
  priority,
}: CircularImageProps) {
  const imageSrc = typeof src === 'string' ? src.trim() : '';
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  if (!imageSrc) return null;

  const showImage = !isError;
  const fallback =
    fallbackClassName || 'bg-gradient-to-br from-[#B7D7EA]/40 to-[#009FE8]/20';

  return (
    <>
      <div
        className={`absolute inset-0 rounded-[inherit] bg-gradient-to-br from-[#F5FAFF] to-[#D7EEF9] transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden
      />
      {!isLoaded && !isError ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`h-10 w-10 rounded-full border-4 border-[#E5F2FA] border-t-[#009FE8] animate-spin ${spinnerClassName || ''}`}
          />
        </div>
      ) : null}

      {showImage ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          sizes={sizes}
          priority={priority}
          onLoadingComplete={() => setIsLoaded(true)}
          onError={() => {
            setIsError(true);
            setIsLoaded(true);
          }}
          className={`transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className || ''}`}
        />
      ) : (
        <div className={`absolute inset-0 ${fallback}`} aria-hidden />
      )}
    </>
  );
}
