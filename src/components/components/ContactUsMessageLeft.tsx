'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitForm } from '@/lib/forms/client';

type InterestedProduct = 'Aseptic Bricks' | 'Aseptic Pillows' | 'Eco-Friendly Board' | 'U Straws';

type FormState = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  companyName: string;
  websiteUrl: string;
  jobFunction: string;
  jobTitle: string;
  countryRegion: string;
  interestedIn: string;
  products: InterestedProduct[];
  message: string;
};

const PRODUCT_OPTIONS: InterestedProduct[] = [
  'Aseptic Bricks',
  'Aseptic Pillows',
  'Eco-Friendly Board',
  'U Straws',
];

const JOB_FUNCTION_OPTIONS = [
  'Select function',
  'C-suite',
  'Product',
  'R&D',
  'Supply Chain',
  'Quality Assurance',
  'Engineering',
  'Marketing',
  'Sales',
  'Customer Service',
  'Procurement',
  'Other',
];

const INTEREST_OPTIONS = [
  'Select option',
  'Products & Services',
  'Job Opportunity',
  'Becoming Our Supplier',
  'Downloading Resources',
  'Other',
];

const COUNTRY_OPTIONS = [
  'Select country',
  'America',
  'Andorra',
  'United',
  'Afghanistan',
  'Antigua',
  'Albania',
  'Armenia',
  'Angola',
  'Argentina',
  'Austria',
  'Australia',
  'Aruba',
  'Azerbaijan',
  'Bosnia',
  'Barbados',
  'Bangladesh',
  'Belgium',
  'Burkina',
  'Bulgaria',
  'Bahrain',
  'Burundi',
  'Benin',
  'Bermuda',
  'Brunei',
  'Bolivia',
  'Brazil',
  'Bahamas',
  'Bhutan',
  'Botswana',
  'Belarus',
  'Belize',
  'Canada',
  'Democratic',
  'Central',
  'Democratic',
  'Switzerland',
  'Chile',
  'Cameroon',
  'China',
  'Colombia',
  'Costa',
  'Cuba',
  'Cape',
  'Cyprus',
  'Czech',
  'Germany',
  'Djibouti',
  'Denmark',
  'Dominica',
  'Dominican',
  'Algeria',
  'Ecuador',
  'Estonia',
  'Egypt',
  'Eritrea',
  'Spain',
  'Ethiopia',
  'Finland',
  'Fiji',
  'Falkland',
  'Micronesia',
  'Faroe',
  'France',
  'Gabon',
  'United',
  'Grenada',
  'Georgia',
  'Ghana',
  'Gibraltar',
  'Gambia',
  'Guinea',
  'Equatorial',
  'Greece',
  'Guatemala',
  'Guinea',
  'Guyana',
  'Hong',
  'Honduras',
  'Croatia',
  'Haiti',
  'Hungary',
  'Indonesia',
  'Ireland',
  'Israel',
  'India',
  'Iraq',
  'Iran',
  'Iceland',
  'Italy',
  'Jamaica',
  'Jordan',
  'Japan',
  'Kenya',
  'Kyrgyzstan',
  'Cambodia',
  'Kiribati',
  'Comoros',
  'Saint',
  'North',
  'South',
  'Kuwait',
  'Cayman',
  'Kazakhstan',
  'Laos',
  'Lebanon',
  'Saint',
  'Liechtenstein',
  'Sri',
  'Liberia',
  'Lesotho',
  'Lithuania',
  'Luxembourg',
  'Latvia',
  'Libya',
  'Morocco',
  'Monaco',
  'Moldova',
  'Montenegro',
  'Madagascar',
  'Macedonia',
  'Mali',
  'Myanmar',
  'Mongolia',
  'Macao',
  'Mauritania',
  'Malta',
  'Mauritius',
  'Maldives',
  'Malawi',
  'Mexico',
  'Malaysia',
  'Mozambique',
  'Namibia',
  'Niger',
  'Nigeria',
  'Nicaragua',
  'Netherlands',
  'Norway',
  'Nepal',
  'Nauru',
  'New',
  'Oman',
  'Panama',
  'Peru',
  'Papua',
  'Philippines',
  'Pakistan',
  'Poland',
  'Puerto',
  'Palestine',
  'Portugal',
  'Palau',
  'Paraguay',
  'Qatar',
  'Romania',
  'Serbia',
  'Russia',
  'Rwanda',
  'Saudi',
  'Solomon',
  'Seychelles',
  'Sudan',
  'Sweden',
  'Singapore',
  'Slovenia',
  'Slovak',
  'Sierra',
  'San',
  'Senegal',
  'Somalia',
  'Suriname',
  'Sao',
  'El',
  'Syria',
  'Swaziland',
  'Chad',
  'Togo',
  'Thailand',
  'Tajikistan',
  'Turkmenistan',
  'Tunisia',
  'Tonga',
  'Turkey',
  'Trinidad',
  'Tuvalu',
  'Taiwan',
  'Tanzania',
  'Ukraine',
  'Uganda',
  'Uruguay',
  'Uzbekistan',
  'Saint',
  'Venezuela',
  'British',
  'Vietnam',
  'Vanuatu',
  'Wallis',
  'Western',
  'Yemen',
  'South',
  'Zambia',
  'Zimbabwe',
];

export default function ContactUsMessageLeft() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    companyName: '',
    websiteUrl: '',
    jobFunction: 'Select function',
    jobTitle: '',
    countryRegion: 'Select country',
    interestedIn: 'Select option',
    products: [],
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedProductsSet = useMemo(() => new Set(formData.products), [formData.products]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
    setFieldErrors((prev) => {
      if (!prev[name as keyof FormState]) return prev;
      const next = { ...prev };
      delete next[name as keyof FormState];
      return next;
    });
  };

  const toggleProduct = (product: InterestedProduct) => {
    setFormData((prev) => {
      const has = prev.products.includes(product);
      const products = has ? prev.products.filter((p) => p !== product) : [...prev.products, product];
      return { ...prev, products };
    });
    setFieldErrors((prev) => {
      if (!prev.products) return prev;
      const next = { ...prev };
      delete next.products;
      return next;
    });
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof FormState, string>> = {};

    if (formData.jobFunction === 'Select function') {
      errors.jobFunction = 'Please select a job function.';
    }

    if (formData.interestedIn === 'Select option') {
      errors.interestedIn = 'Please select an option.';
    }

    if (formData.countryRegion === 'Select country') {
      errors.countryRegion = 'Please select a country/region.';
    }

    if (!formData.websiteUrl.trim()) {
      errors.websiteUrl = 'Company website URL is required.';
    }

    const selectedProducts = formData.products.join(', ');
    if (!selectedProducts) {
      errors.products = 'Please select at least one product.';
    } else if (selectedProducts.length > 50) {
      errors.products = 'Please select fewer products (max 50 characters).';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await submitForm('contact', {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      emailAddress: formData.emailAddress.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      companyName: formData.companyName.trim(),
      websiteUrl: formData.websiteUrl.trim(),
      jobFunction: formData.jobFunction.trim(),
      jobTitle: formData.jobTitle.trim(),
      countryRegion: formData.countryRegion.trim(),
      interestedIn: formData.interestedIn.trim(),
      products: formData.products,
      message: formData.message.trim(),
    });

    if (result.ok) {
      router.push('/thank-you?form=contact');
      return;
    }

    setErrorMessage(result.message);
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

  return (
    <div>
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6">
        Send us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="firstName">
              First Name <span className="text-[#333]">*</span>
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              maxLength={50}
              placeholder="Jane"
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            />
            {fieldErrors.firstName ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.firstName}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="lastName">
              Last Name <span className="text-[#333]">*</span>
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              maxLength={50}
              placeholder="Doe"
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            />
            {fieldErrors.lastName ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.lastName}</p>
            ) : null}
          </div>
        </div>

        {/* Second row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="emailAddress">
              Email Address <span className="text-[#333]">*</span>
            </label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              maxLength={50}
              placeholder="jane@company.com"
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            />
            {fieldErrors.emailAddress ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.emailAddress}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="phoneNumber">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={20}
              placeholder="+1 (555) 000-0000"
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            />
            {fieldErrors.phoneNumber ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.phoneNumber}</p>
            ) : null}
          </div>
        </div>

        {/* Third row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="companyName">
              Company Name <span className="text-[#333]">*</span>
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              maxLength={50}
              placeholder="Enter company name"
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            />
            {fieldErrors.companyName ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.companyName}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="websiteUrl">
              Company Website URL <span className="text-[#333]">*</span>
            </label>
            <input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              maxLength={50}
              placeholder="https://www.example.com"
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            />
            {fieldErrors.websiteUrl ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.websiteUrl}</p>
            ) : null}
          </div>
        </div>

        {/* Fourth row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="jobFunction">
              Job Function <span className="text-[#333]">*</span>
            </label>
            <select
              id="jobFunction"
              name="jobFunction"
              value={formData.jobFunction}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            >
              {JOB_FUNCTION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {fieldErrors.jobFunction ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.jobFunction}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="jobTitle">
              Job Title <span className="text-[#333]">*</span>
            </label>
            <input
              id="jobTitle"
              name="jobTitle"
              type="text"
              value={formData.jobTitle}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              maxLength={50}
              placeholder="Select title"
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            />
            {fieldErrors.jobTitle ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.jobTitle}</p>
            ) : null}
          </div>
        </div>

        {/* Fifth row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="countryRegion">
              Country/Region <span className="text-[#333]">*</span>
            </label>
            <select
              id="countryRegion"
              name="countryRegion"
              value={formData.countryRegion}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            >
              {COUNTRY_OPTIONS.map((opt, index) => (
                <option key={`${opt}-${index}`} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {fieldErrors.countryRegion ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.countryRegion}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2" htmlFor="interestedIn">
              What are you interested in? <span className="text-[#333]">*</span>
            </label>
            <select
              id="interestedIn"
              name="interestedIn"
              value={formData.interestedIn}
              onChange={handleChange}
              disabled={isSubmitting}
              required
              className="w-full px-6 py-4 rounded-[15px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base disabled:opacity-70"
            >
              {INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {fieldErrors.interestedIn ? (
              <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.interestedIn}</p>
            ) : null}
          </div>
        </div>

        {/* Products */}
        <div>
          <p className="text-sm font-medium text-black mb-3">Interested Products</p>
          <div className="flex flex-wrap gap-4">
            {PRODUCT_OPTIONS.map((product) => {
              const checked = selectedProductsSet.has(product);
              return (
                <label key={product} className="inline-flex items-center gap-2 text-sm text-black">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleProduct(product)}
                    disabled={isSubmitting}
                    className="h-4 w-4 accent-[#009FE8]"
                  />
                  <span className="select-none">{product}</span>
                </label>
              );
            })}
          </div>
          {fieldErrors.products ? (
            <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.products}</p>
          ) : null}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-black mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={5}
            maxLength={200}
            placeholder="How can we help you?"
            className="w-full px-6 py-4 rounded-[15px] border border-gray-200  focus:outline-none focus:ring-2 focus:ring-[#009FE8] text-black placeholder-gray-400 text-base resize-none disabled:opacity-70"
          />
          {fieldErrors.message ? (
            <p className="mt-2 text-sm text-[#B42318]">{fieldErrors.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer justify-center inline-flex items-center bg-[#009FE8] text-white text-base md:text-lg font-bold uppercase tracking-wider hover:bg-[#0077B6] transition-colors group py-4 rounded-[50px] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Sending...' : 'Send Inquiry'}
        </button>

        {errorMessage ? (
          <p className="text-sm text-[#B42318]" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </div>
  );
}
