import Image from 'next/image';

/** Public asset used for all video play controls site-wide */
export const PLAY_VIDEO_ICON_SRC = '/play_icon_image.png' as const;

type PlayVideoIconProps = {
  /** Hero / full-bleed banners (matches VideoBanner) */
  variant?: 'hero' | 'card' | 'compact';
  className?: string;
};

const dimensionByVariant: Record<NonNullable<PlayVideoIconProps['variant']>, { width: number; height: number }> = {
  hero: { width: 100, height: 100 },
  card: { width: 80, height: 80 },
  compact: { width: 20, height: 20 },
};

const classByVariant: Record<NonNullable<PlayVideoIconProps['variant']>, string> = {
  hero: 'group-hover:scale-110 transition-transform lg:w-[100px] lg:h-[100px] w-[60px] h-[60px]',
  card: 'group-hover:scale-110 transition-transform w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
  compact: 'w-5 h-5',
};

/**
 * Shared play control graphic for video triggers (modals, banners, cards).
 */
export default function PlayVideoIcon({ variant = 'card', className = '' }: PlayVideoIconProps) {
  const { width, height } = dimensionByVariant[variant];
  const base = classByVariant[variant];
  return (
    <Image
      src={PLAY_VIDEO_ICON_SRC}
      alt=""
      width={width}
      height={height}
      className={[base, className].filter(Boolean).join(' ')}
      aria-hidden
    />
  );
}
