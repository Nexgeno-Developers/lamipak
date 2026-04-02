import type { GreenPhotovoltaicProjectSectionData } from '@/lib/api/sustainability_layout_3';
import { RichText } from '@/components/common/RichText';

export interface GreenPhotovoltaicProjectSectionProps {
  data: GreenPhotovoltaicProjectSectionData;
}

export default function GreenPhotovoltaicProjectSection({
  data,
}: GreenPhotovoltaicProjectSectionProps) {
  return (
    <>
      {data.htmlItems.map((html, idx) => (
        <RichText key={idx} as="div" html={html} />
      ))}
    </>
  );
}
