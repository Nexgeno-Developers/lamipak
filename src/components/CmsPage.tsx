import { RichText } from '@/components/common/RichText';

export interface CmsPageProps {
  data: {
    title: string;
    content: string;
    [key: string]: unknown;
  };
}

export default function CmsPage({ data }: CmsPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-6">{data.title}</h1>
        <div className="prose max-w-none text-black">
          {/* CMS/text-editor content may be either HTML or plain text with line breaks */}
          {/* RichText will preserve paragraph breaks */}
          <RichText as="div" html={data.content} />
        </div>
      </div>
    </main>
  );
}

