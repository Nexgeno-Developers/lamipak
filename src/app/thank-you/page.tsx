import Link from 'next/link';
import type { FormType } from '@/lib/forms/types';

type Step = {
  title: string;
  detail: string;
};

type Cta = {
  text: string;
  href: string;
};

type ThankYouContent = {
  kicker: string;
  title: string;
  description: string;
  highlight: string;
  nextSteps: Step[];
  primaryCta: Cta;
  secondaryCta: Cta;
};

const THANK_YOU_CONTENT: Record<FormType, ThankYouContent> = {
  subscription: {
    kicker: 'Subscription received',
    title: 'Welcome to the Lamipak newsletter',
    description:
      'You are all set. We will share product innovations, sustainability updates, and insights that matter to your business.',
    highlight: 'You are now subscribed.',
    nextSteps: [
      {
        title: 'Confirm your subscription',
        detail: 'Check your inbox for a confirmation email and verify your address.',
      },
      {
        title: 'Stay ahead of the curve',
        detail: 'Expect monthly updates with new packaging trends and launches.',
      },
      {
        title: 'Manage preferences anytime',
        detail: 'Use the link in any email to update your interests.',
      },
    ],
    primaryCta: { text: 'Back to Home', href: '/' },
    secondaryCta: { text: 'Explore Products', href: '/products' },
  },
  get_in_touch: {
    kicker: 'Request received',
    title: 'Our technical team is on it',
    description:
      'Thanks for reaching out. We have your request and will connect you with the right technical expert.',
    highlight: 'We typically respond within 1-2 business days.',
    nextSteps: [
      {
        title: 'Technical review',
        detail: 'Your request is queued for a specialist to review.',
      },
      {
        title: 'Prepare key details',
        detail: 'Have your line specs or challenges ready for a faster response.',
      },
      {
        title: 'Follow-up confirmation',
        detail: 'Look for our email with the next steps.',
      },
    ],
    primaryCta: { text: 'Explore Technical Services', href: '/technical-services' },
    secondaryCta: { text: 'View Products', href: '/products' },
  },
  contact: {
    kicker: 'Message sent',
    title: 'Thanks for contacting Lamipak',
    description:
      'Your inquiry is in our hands. We will review the details and route it to the right team.',
    highlight: 'You will hear back soon.',
    nextSteps: [
      {
        title: 'Review and assignment',
        detail: 'We match your request to the best team internally.',
      },
      {
        title: 'Timely response',
        detail: 'You can expect a reply within 1-2 business days.',
      },
      {
        title: 'Additional information',
        detail: 'Reply to our email if you want to add more context.',
      },
    ],
    primaryCta: { text: 'View Our Products', href: '/products' },
    secondaryCta: { text: 'Back to Home', href: '/' },
  },
};

const FALLBACK_CONTENT: ThankYouContent = {
  kicker: 'Submission received',
  title: 'Thank you for reaching out',
  description: 'We have received your message and will be in touch shortly.',
  highlight: 'We typically respond within 1-2 business days.',
  nextSteps: [
    {
      title: 'Review and assign',
      detail: 'Your message is being reviewed by the appropriate team.',
    },
    {
      title: 'Follow-up email',
      detail: 'Keep an eye on your inbox for our response.',
    },
    {
      title: 'Stay connected',
      detail: 'Reply to our email if you want to add details.',
    },
  ],
  primaryCta: { text: 'Back to Home', href: '/' },
  secondaryCta: { text: 'Explore Products', href: '/products' },
};

type ThankYouPageProps = {
  searchParams: Promise<{ form?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const formKey = (params?.form || '').toLowerCase() as FormType;
  const content = THANK_YOU_CONTENT[formKey] ?? FALLBACK_CONTENT;

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <section className="relative overflow-hidden bg-[#0E233C]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,159,232,0.35),_transparent_55%)]" />
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-[#009FE8]/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-40px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center text-white">
            <span className="inline-flex items-center rounded-full border border-white/30 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/80">
              {content.kicker}
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-bold leading-tight">
              {content.title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-white/85">
              {content.description}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-[50px] bg-white/10 px-4 py-2 text-sm text-white/90">
              <span className="h-2 w-2 rounded-full bg-[#009FE8]" />
              {content.highlight}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[40px] bg-white p-8 md:p-12 shadow-[0_30px_80px_rgba(15,35,60,0.08)]">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0E233C]">
                What happens next
              </h2>
              <div className="mt-6 grid gap-4">
                {content.nextSteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex items-start gap-4 rounded-[24px] border border-[#E5EEF5] bg-[#F8FBFF] p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#009FE8] text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#0E233C]">{step.title}</p>
                      <p className="mt-1 text-sm text-[#233447]/80">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[40px] bg-[#0E233C] p-8 md:p-10 text-white shadow-[0_30px_80px_rgba(15,35,60,0.2)]">
              <h3 className="text-xl md:text-2xl font-bold">Keep exploring</h3>
              <p className="mt-3 text-sm md:text-base text-white/80">
                Discover more about our packaging expertise, sustainability programs, and services.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={content.primaryCta.href}
                  className="inline-flex items-center justify-center rounded-[50px] bg-[#009FE8] px-6 py-3 text-sm md:text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0077B6]"
                >
                  {content.primaryCta.text}
                </Link>
                <Link
                  href={content.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-[50px] border border-white/40 px-6 py-3 text-sm md:text-base font-bold uppercase tracking-wider text-white transition-colors hover:border-white"
                >
                  {content.secondaryCta.text}
                </Link>
              </div>
              <div className="mt-8 rounded-[24px] border border-white/15 bg-white/5 p-4 text-sm text-white/80">
                You can reply to our confirmation email at any time to add more context.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
