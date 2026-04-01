import type { OnePackOneCodeLandingSectionData } from '@/lib/api/product_category_layout_4';
import CallToAction from '../home/CallToAction';
import NewsletterSubscription from '../home/NewsletterSubscription';
import OnePackOneCodeLandingSectionClient from './OnePackOneCodeLandingSectionClient';

export function OnePackOneCodeLandingSection({ data }: { data: OnePackOneCodeLandingSectionData & { title?: string } }) {
  return (
    <>
      <OnePackOneCodeLandingSectionClient data={data} />
      <CallToAction />
      <NewsletterSubscription />
    </>
  );
}

