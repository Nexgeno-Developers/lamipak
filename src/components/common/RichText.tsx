import type { ElementType, ReactElement } from 'react';
import { decodeHtmlEntities } from '@/lib/htmlText';

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

  const decoded = decodeHtmlEntities(html);

  // If the editor provides HTML tags (`<p>`, `<strong>`, etc.), let the browser render them.
  if (/<[^>]+>/.test(decoded)) {
    return <Tag className={className} dangerouslySetInnerHTML={{ __html: decoded }} />;
  }

  // Otherwise treat it as plain text and preserve paragraph breaks:
  // - blank line => paragraph break (double `<br />`)
  // - single newline => line break (`<br />`)
  const text = decoded.replace(/\r\n/g, '\n');
  const parts = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return null;

  const isInline = Tag === 'span' || Tag === 'a';
  const nodes: Array<string | ReactElement> = [];

  parts.forEach((p, pi) => {
    const lines = p.split('\n');
    lines.forEach((line, li) => {
      if (li > 0) nodes.push(<br key={`br-${pi}-${li}`} />);
      nodes.push(line);
    });

    if (pi < parts.length - 1) {
      // Separate paragraphs.
      nodes.push(<br key={`psep-1-${pi}`} />);
      nodes.push(<br key={`psep-2-${pi}`} />);
    }
  });

  return <Tag className={className}>{isInline ? nodes : nodes}</Tag>;
}

