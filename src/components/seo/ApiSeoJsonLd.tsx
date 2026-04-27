import { parseLdJsonSchema } from '@/components/seo/buildApiMetadata';
import { getCanonicalUrl } from '@/config/site';

type Props = {
  seo?: Record<string, unknown> | null;
  /** Request path, e.g. `/about-lamipak/about-company` */
  pathname: string;
};

/**
 * One JSON-LD block per page from CMS `seo.schema` (object, JSON string, or `<script type="application/ld+json">…</script>`).
 * Each API page can send different `name`, `url`, `@type`, etc.
 */
export default function ApiSeoJsonLd({ seo, pathname }: Props) {
  const parsedSchema = parseLdJsonSchema(seo?.schema);
  if (!parsedSchema) return null;

  const rawCanonical = seo?.canonical_url;
  const path = pathname.replace(/\/$/, '') || '/';
  const canonicalUrl =
    typeof rawCanonical === 'string' && /^https?:\/\//i.test(rawCanonical)
      ? rawCanonical
      : getCanonicalUrl(
          typeof rawCanonical === 'string' && rawCanonical.trim()
            ? rawCanonical
            : `${path}/`,
        );

  const existingUrl = parsedSchema.url;
  const urlFromSchema =
    typeof existingUrl === 'string' && /^https?:\/\//i.test(existingUrl.trim())
      ? existingUrl.trim()
      : typeof existingUrl === 'string' && existingUrl.trim().startsWith('/')
        ? getCanonicalUrl(existingUrl.trim())
        : null;

  const schemaData = {
    ...parsedSchema,
    url: urlFromSchema ?? canonicalUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
