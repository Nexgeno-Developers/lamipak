'use client';

import { useEffect, useId, useState } from 'react';
import Image from 'next/image';

type VideoModalClientProps = {
  /** Video URL: mp4/webm or YouTube/Vimeo embed link */
  videoUrl: string;
  /** Optional modal title text */
  modalTitle?: string;
  /** Optional: poster/thumbnail behind play button */
  posterUrl?: string;
  posterAlt?: string;
  /** Optional: extra classes for wrapper */
  className?: string;
};

const isProbablyMp4 = (url: string) => /\.mp4(\?|#|$)/i.test(url);
const isProbablyWebm = (url: string) => /\.webm(\?|#|$)/i.test(url);

export default function VideoModalClient({
  videoUrl,
  modalTitle = 'Video',
  posterUrl,
  posterAlt = '',
  className,
}: VideoModalClientProps) {
  const [open, setOpen] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const titleId = useId();
  const modalId = useId();

  useEffect(() => {
    if (!open) return;
    setPlayerReady(false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    // Warm up common video hosts so modal playback starts faster.
    const urls = [
      'https://www.youtube.com',
      'https://www.youtube-nocookie.com',
      'https://i.ytimg.com',
      'https://player.vimeo.com',
    ];
    const links = urls.map((href) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
      return link;
    });
    return () => {
      links.forEach((link) => {
        if (link.parentNode) link.parentNode.removeChild(link);
      });
    };
  }, []);

  const isFileVideo = isProbablyMp4(videoUrl) || isProbablyWebm(videoUrl);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative w-full h-full overflow-hidden focus:outline-none cursor-pointer"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? modalId : undefined}
      >
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt={posterAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-[#0E233C] opacity-35" />

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="">
            <span className="">
              <Image
                src="/play_icon_image.png"
                alt=""
                width={100}
                height={100}
                className="w-[70px] h-[70px]"
                aria-hidden
              />
            </span>
          </span>
        </span>

        <span className="sr-only">Play video</span>
      </button>

      {open && (
        <div
          id={modalId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            aria-label="Close video"
          />

          <div className="relative z-[101] w-full max-w-5xl rounded-2xl bg-black overflow-hidden border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#0E233C]">
              <p id={titleId} className="text-white text-sm font-semibold">
                {modalTitle}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full bg-black">
              <div className="w-full aspect-video">
                {!playerReady && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
                    <div className="h-10 w-10 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  </div>
                )}
                {isFileVideo ? (
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    preload="auto"
                    className="w-full h-full"
                    onCanPlay={() => setPlayerReady(true)}
                  />
                ) : (
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Video"
                    loading="eager"
                    onLoad={() => setPlayerReady(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

