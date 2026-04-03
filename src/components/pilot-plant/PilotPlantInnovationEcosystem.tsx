import type { PilotPlantEcosystemStep } from '@/lib/api/pilot_plant_layout';

type Props = {
  titleBlack: string;
  titleBlue: string;
  steps: PilotPlantEcosystemStep[];
};

export default function PilotPlantInnovationEcosystem({ titleBlack, titleBlue, steps }: Props) {
  return (
    <section className="bg-white pb-14 pt-4 md:pb-20 md:pt-6 lg:pb-24">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-center text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
          <span className="text-black">{titleBlack}</span>{' '}
          <span className="text-[#009FE8]">{titleBlue}</span>
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {steps.map((step) => (
            <article
              key={step.id}
              className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_12px_40px_rgba(10,39,68,0.08)] ring-1 ring-black/[0.05]"
            >
              <div className="bg-[#F4F7F9] px-5 py-8 text-center md:py-10">
                <p className="text-sm font-bold uppercase tracking-wide text-[#009FE8] md:text-base">
                  <span>{step.step}</span> <span className="ml-1">{step.phase}</span>
                </p>
              </div>
              <div className="flex flex-1 flex-col px-5 pb-8 pt-6 md:px-6">
                <h3 className="text-lg font-bold text-black md:text-xl">{step.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-black/70 md:text-base">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
