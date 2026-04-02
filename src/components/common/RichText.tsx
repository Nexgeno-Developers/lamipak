import type { ElementType } from 'react';

type RichTextProps = {
  html?: string | null;
  className?: string;
  as?: ElementType;
};

/**
 * Renders HTML coming from the CMS/text editor.
 * Use only for trusted/sanitized editor HTML.
 */
export function RichText({ html, className, as: Tag = 'div' }: RichTextProps) {
  if (!html) return null;
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

