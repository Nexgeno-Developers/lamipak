'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { submitForm } from '@/lib/forms/client';

type FormState = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  message: string;
};

interface ConnectTechnicalExpertsClientProps {
  headingHtml?: string;
  formTitleHtml?: string;
  illustrationImage: string;
  illustrationAlt: string;
}

/**
 * Connect with Technical Experts Component (Client Component)
 *
 * Displays a contact form section with illustration.
 */
export default function ConnectTechnicalExpertsClient({
  headingHtml,
  formTitleHtml,
  illustrationImage,
  illustrationAlt,
}: ConnectTechnicalExpertsClientProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const result = await submitForm('message', {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      emailAddress: formData.emailAddress.trim(),
      message: formData.message.trim(),
    });

    if (result.ok) {
      router.push('/thank-you?form=message');
      return;
    }

    setError(result.message);
    if (result.fieldErrors) {
      const nextErrors: Partial<Record<keyof FormState, string>> = {};
      for (const [key, value] of Object.entries(result.fieldErrors)) {
        if (key in formData) {
          nextErrors[key as keyof FormState] = value;
        }
      }
      setFieldErrors(nextErrors);
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
    setFieldErrors((prev) => {
      if (!prev[e.target.name as keyof FormState]) return prev;
      const next = { ...prev };
      delete next[e.target.name as keyof FormState];
      return next;
    });
  };

  return (
    <section className="bg-gray-50 py-6 md:py-8 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        {headingHtml ? (
          <div className="mb-6 text-center md:mb-8 lg:mb-12">
            <h2
              className="text-xl font-bold leading-snug text-black sm:text-2xl md:text-4xl lg:text-5xl"
              dangerouslySetInnerHTML={{ __html: headingHtml }}
            />
          </div>
        ) : null}

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl bg-white md:rounded-[50px]">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[65%_35%]">
            {/* Left Section - Contact Form */}
            <div className="px-4 pb-8 pt-6 sm:px-6 md:p-10 lg:p-12">
              {/* Form Title */}
              {formTitleHtml ? (
                <h3
                  className="mb-4 text-[17px] font-bold leading-snug text-black sm:text-lg md:mb-6 md:text-3xl lg:mb-8"
                  dangerouslySetInnerHTML={{ __html: formTitleHtml }}
                />
              ) : null}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Row - First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                      maxLength={50}
                      className="w-full lg:px-6 px-4 lg:py-4 py-3 bg-gray-100 rounded-[25px] border-none focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
                    />
                    {fieldErrors.firstName ? (
                      <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.firstName}</p>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                      maxLength={50}
                      className="w-full lg:px-6 px-4 lg:py-4 py-3 bg-gray-100 rounded-[25px] border-none focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
                    />
                    {fieldErrors.lastName ? (
                      <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.lastName}</p>
                    ) : null}
                  </div>
                </div>

                {/* Second Row - Phone Number & Email Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      maxLength={20}
                      className="w-full lg:px-6 px-4 lg:py-4 py-3 bg-gray-100 rounded-[25px] border-none focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
                    />
                    {fieldErrors.phoneNumber ? (
                      <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.phoneNumber}</p>
                    ) : null}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="emailAddress"
                      placeholder="Email Address"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                      maxLength={50}
                      className="w-full lg:px-6 px-4 lg:py-4 py-3 bg-gray-100 rounded-[25px] border-none focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
                    />
                    {fieldErrors.emailAddress ? (
                      <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.emailAddress}</p>
                    ) : null}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    rows={5}
                    maxLength={200}
                    className="w-full resize-none rounded-[25px] border-none bg-gray-100 px-4 py-3 text-base text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009FE8] disabled:opacity-70 sm:px-6 sm:py-4"
                  />
                  {fieldErrors.message ? (
                    <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.message}</p>
                  ) : null}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center text-[#009FE8] text-base md:text-lg font-bold uppercase tracking-wider hover:text-[#0077B6] transition-colors group disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>

                {error ? (
                  <p className="text-sm text-[#B42318]" role="alert">
                    {error}
                  </p>
                ) : null}
              </form>
            </div>

            {/* Right Section - Illustration */}
            <div className="relative flex items-center justify-center bg-white px-4 pb-6 pt-0 sm:px-6 sm:pb-8 lg:p-8 lg:pt-8">
              <Image
                src={illustrationImage}
                alt={illustrationAlt}
                width={600}
                height={600}
                className="h-[220px] w-full rounded-2xl object-cover sm:h-[280px] md:h-[320px] lg:h-[500px] lg:rounded-[50px]"
                sizes="(max-width: 1024px) 100vw, 35vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
