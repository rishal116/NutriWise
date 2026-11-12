import { CheckCircle2, Info, Plus, Sparkles, Trash2 } from "lucide-react";

import { SectionCard } from "./FormFields"; 
import { PLATFORM_FEATURES } from "@/constants/platform-features";

interface PlanDeliverablesProps {
  features: string[];
  error?: string;
  onChange: (features: string[]) => void;
}

export default function PlanDeliverables({
  features,
  error,
  onChange,
}: PlanDeliverablesProps) {
  const updateFeature = (index: number, value: string) => {
    const updated = [...features];
    updated[index] = value;
    onChange(updated);
  };

  const getFeatureError = (feature: string, index: number) => {
    const trimmed = feature.trim();

    if (!trimmed) return null;

    const isDuplicate = features.some(
      (other, otherIndex) =>
        otherIndex !== index &&
        other.trim().toLowerCase() === trimmed.toLowerCase(),
    );

    if (isDuplicate) return "Duplicate deliverable";

    if (trimmed.length < 3) return "At least 3 characters required";

    const isPlatformFeature = PLATFORM_FEATURES.some(
      (platformFeature) =>
        platformFeature.toLowerCase() === trimmed.toLowerCase(),
    );

    if (isPlatformFeature) {
      return "Already included platform-wide";
    }

    return null;
  };

  return (
    <SectionCard icon={Sparkles} title="Deliverables">
      <div className="space-y-3">
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3.5">
          <Info size={15} className="mt-0.5 shrink-0 text-blue-500" />

          <div className="min-w-0">
            <p className="mb-1.5 text-xs font-bold text-blue-900">
              Already included in every plan
            </p>

            <p className="mb-2 text-xs text-blue-700">
              Don&apos;t add these again as individual deliverables.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {PLATFORM_FEATURES.map((feature) => (
                <span
                  key={feature}
                  className="rounded-md border border-blue-200 bg-white px-2 py-0.5 text-[11px] font-medium text-blue-700"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {features.map((feature, index) => {
          const fieldError = getFeatureError(feature, index);

          return (
            <div key={index}>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <CheckCircle2
                    className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                      fieldError ? "text-red-400" : "text-emerald-500"
                    }`}
                  />

                  <input
                    value={feature}
                    onChange={(event) =>
                      updateFeature(index, event.target.value)
                    }
                    aria-label={`Deliverable ${index + 1}`}
                    aria-invalid={Boolean(fieldError)}
                    placeholder="e.g. Weekly personalized meal plan"
                    className={`w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 ${
                      fieldError
                        ? "border-red-300 focus:ring-red-500/20"
                        : "border-slate-200 focus:ring-emerald-500/20"
                    }`}
                  />
                </div>

                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        features.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    aria-label={`Remove deliverable ${index + 1}`}
                    className="p-2.5 text-slate-400 transition-colors hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {fieldError && (
                <p className="mt-1 pl-1 text-xs font-medium text-red-500">
                  {fieldError}
                </p>
              )}
            </div>
          );
        })}

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <button
          type="button"
          onClick={() => onChange([...features, ""])}
          className="mt-2 flex items-center gap-1 text-sm font-bold text-emerald-600"
        >
          <Plus size={16} />
          Add Deliverable
        </button>
      </div>
    </SectionCard>
  );
}
