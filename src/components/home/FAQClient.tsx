import type { FAQData, FAQItem } from '@/fake-api/homepage';
import FAQItemClient from './FAQItemClient';

interface FAQClientProps {
  data: FAQData;
}

export default function FAQClient({ data }: FAQClientProps) {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16">
          <span className="text-gray-900">Frequently Asked</span>{' '}
          <span className="text-[#009FE8]">Questions</span>
        </h2>

        {/* FAQ List */}
        <div className="">
          {data.items.map((item) => (
            <FAQItemClient key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
