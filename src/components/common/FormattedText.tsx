import type { ElementType, ReactElement } from 'react';
import { decodeHtmlEntities, formatBoldText } from '@/lib/htmlText';

type FormattedTextProps = {
  text?: string | null;
  className?: string;
  as?: ElementType;
};

export function FormattedText({ text, className, as: Tag = 'span' }: FormattedTextProps) {
  if (!text) return null;

  const decoded = decodeHtmlEntities(text);
  const formatted = formatBoldText(decoded);

  if (/<[^>]+>/.test(formatted)) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: formatted }} />;
  }

  return <Tag className={className}>{formatted}</Tag>;
}
