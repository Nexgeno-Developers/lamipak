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
      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center bg-white rounded-[50px] overflow-hidden p-2 sm:p-[10px]">
        {/* Email Input */}
        <input
          type="email"
          placeholder={placeholder}
          required
          className="w-full min-w-0 flex-1 px-4 py-3 sm:py-2 bg-transparent text-black placeholder-gray-400 focus:outline-none border-none text-base"
        />

        {/* Subscribe Button - Inside the form */}
        <button
          type="submit"
          className="cursor-pointer w-full sm:w-auto shrink-0 px-4 py-3 sm:py-2 bg-[#009FE8] rounded-[50px] text-white text-sm sm:text-base font-bold uppercase tracking-wider hover:bg-[#0077B6] transition-colors whitespace-nowrap"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}
