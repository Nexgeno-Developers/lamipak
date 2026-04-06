import type { PilotPlantPageData } from '@/lib/api/pilot_plant_layout';
import { PilotPlantScopeIcon } from '@/components/pilot-plant/scopeIcons';

type Props = Pick<
  PilotPlantPageData,
  | 'scopeLabel'
  | 'scopeTitleBlue'
  | 'scopeTitleBlack'
  | 'scopeGrid'
  | 'agileEyebrow'
  | 'agileTitle'
  | 'agileBody'
  | 'agileHighlights'
>;

export default function PilotPlantScopeAndAgile({
  scopeLabel,
  scopeTitleBlue,
  scopeTitleBlack,
  scopeGrid,
  agileEyebrow,
  agileTitle,
  agileBody,
  agileHighlights,
}: Props) {
  return (
    <section className="bg-gray-50 pb-14 md:pb-20 lg:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20 lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase text-[#009FE8] md:text-sm">
              {scopeLabel}
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              <span className="text-[#009FE8]">{scopeTitleBlue}</span>{' '}
              <span className="text-black">{scopeTitleBlack}</span>
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 md:gap-5">
              {scopeGrid.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-[30px] bg-[#EDF0F1] p-5 "
                >
                  <PilotPlantScopeIcon id={item.icon} />
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-black md:text-[11px]">
                    {item.categoryLabel}
                  </p>
                  <p className="mt-1 text-sm font-bold leading-snug text-black md:text-base">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[50px] bg-[#009FE8] p-8 text-white md:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90 md:text-sm">{agileEyebrow}</p>
            <h3 className="mt-4 text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">{agileTitle}</h3>
            <p className="mt-6 text-base leading-relaxed text-white/95 md:text-base">{agileBody}</p>
            <div className="mt-8 space-y-6">
              {agileHighlights.map((h, i) => (
                <div key={i}>
                  <p className="font-bold text-white pb-0 mb-0">{h.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/90 md:text-base">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
