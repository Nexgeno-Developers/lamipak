interface NewsletterFormProps {
  placeholder: string;
  buttonText: string;
}

/**
 * Newsletter Form Component (Server Component)
 * 
 * Renders the newsletter subscription form structure.
 */
export default function NewsletterForm({ placeholder, buttonText }: NewsletterFormProps) {
  return (
    <form className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center bg-white rounded-[50px] overflow-hidden p-[10px]">
        {/* Email Input */}
        <input
          type="email"
          placeholder={placeholder}
          required
          className="flex-1 px-4 py-2 bg-transparent text-black placeholder-gray-400 focus:outline-none border-none"
        />

        {/* Subscribe Button - Inside the form */}
        <button
          type="submit"
          className="cursor-pointer px-4 py-2 bg-[#009FE8] rounded-[50px] text-white font-bold uppercase tracking-wider hover:bg-[#0077B6] transition-colors whitespace-nowrap"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
