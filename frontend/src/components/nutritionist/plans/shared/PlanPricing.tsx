import { AlertCircle, Info, IndianRupee } from "lucide-react";

import { Input, SectionCard } from "./FormFields";

import type { PlanPriceLimits } from "@/types/nutritionist/plan/create-plan-form.types";

interface PlanPricingProps {
  price: string;
  durationDays: string;
  error?: string;
  priceLimits: PlanPriceLimits | null;
  onChange: (value: string) => void;
}

export default function PlanPricing({
  price,
  durationDays,
  error,
  priceLimits,
  onChange,
}: PlanPricingProps) {
  const numericPrice = Number(price);
  const numericDuration = Number(durationDays);

  const hasValidDuration =
    Number.isInteger(numericDuration) &&
    numericDuration >= 1 &&
    numericDuration <= 365;

  const maxPrice =
    priceLimits && hasValidDuration
      ? priceLimits.maxPerDay * numericDuration
      : null;

  const isOutsidePriceRange =
    price.trim() !== "" &&
    priceLimits !== null &&
    (numericPrice < priceLimits.min ||
      (maxPrice !== null && numericPrice > maxPrice));

  return (
    <SectionCard icon={IndianRupee} title="Pricing">
      <div className="space-y-5">
        <Input
          label="Plan Price"
          placeholder="Enter price"
          value={price}
          error={error}
          prefix={<IndianRupee className="h-4 w-4 text-slate-400" />}
          onChange={(value) => {
            if (/^\d*$/.test(value)) {
              onChange(value);
            }
          }}
        />

        {priceLimits && maxPrice !== null && (
          <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
            <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />

            <p className="text-xs leading-relaxed text-slate-500">
              Allowed price: ₹{priceLimits.min.toLocaleString("en-IN")} – ₹
              {maxPrice.toLocaleString("en-IN")}
            </p>
          </div>
        )}

        {isOutsidePriceRange && !error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3">
            <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-500" />

            <p className="text-xs font-medium leading-tight text-red-700">
              {numericPrice < priceLimits!.min
                ? `Minimum plan price is ₹${priceLimits!.min.toLocaleString("en-IN")}.`
                : `Maximum price for ${numericDuration} days is ₹${maxPrice!.toLocaleString("en-IN")}.`}
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
