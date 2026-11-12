
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

interface PlanDeliverablesProps {
  features: string[];
}

export default function PlanDeliverables({
  features,
}: PlanDeliverablesProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <ShieldCheck className="text-emerald-500" size={24} />
            Plan Deliverables
          </h2>

          <p className="pl-9 text-xs font-bold tracking-widest text-slate-400 uppercase">
            Client Value Props
          </p>
        </div>

        <Sparkles
          className="hidden text-emerald-200 sm:block"
          size={28}
        />
      </div>

      {features.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={`${feature}-${index}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:border-emerald-100 hover:bg-emerald-50/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                <CheckCircle2 size={18} />
              </div>

              <span className="text-sm leading-tight font-semibold text-slate-700">
                {feature}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No deliverables have been added to this plan yet.
        </p>
      )}
    </section>
  );
}
