'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export default function VideoModalBanner({
  videoUrl,
  backgroundImage,
}: {
  videoUrl: string;
  backgroundImage?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Autoplay when modal opens
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p) p.catch(() => undefined);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    // Stop video when modal closes
    const v = videoRef.current;
    if (!v) return;
    try {
      v.pause();
      v.currentTime = 0;
    } catch {
      // ignore
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const safeBackground = useMemo(() => backgroundImage || null, [backgroundImage]);

  return (
    <>
      <section className="relative min-h-[70dvh] h-[100dvh] md:h-screen overflow-hidden bg-[#0c1f45]">
        <div className="absolute inset-0">
          {safeBackground ? (
            <img
              src={safeBackground}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gray-800" />
          )}
          <div className="absolute inset-0 bg-[#0E233C8C]" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="cursor-pointer w-20 h-20 md:w-24 md:h-24 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center transition-all group shadow-lg"
            aria-label="Play video"
          >
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-gray-800 ml-1 group-hover:scale-110 transition-transform"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 h-10 w-10 rounded-full bg-white/90 text-black flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Close video"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-auto max-h-[80vh] bg-black rounded-[18px]"
            />
          </div>
        </div>
      )}
    </>
  );
}

