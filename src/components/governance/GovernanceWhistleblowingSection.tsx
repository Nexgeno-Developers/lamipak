export type GovernanceWhistleblowingSectionData = {
  layout: 'whistleblowing';
  eyebrow: string;
  titleBlue: string;
  title: string;
  paragraphs: string[];
};

export default function GovernanceWhistleblowingSection({
  data,
}: {
  data: GovernanceWhistleblowingSectionData;
}) {
  return (
    <section className="bg-[#EDF0F1] py-10 md:py-20 mt-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[#009FE8] font-semibold text-sm md:text-base">
            {data.eyebrow}
          </div>

          <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">
            <span className="text-[#009FE8]">{data.titleBlue}</span>{' '}
            <span className="text-black">{data.title}</span>
          </h2>

          <div className="mt-5 text-black leading-relaxed text-base  space-y-4">
            {data.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

