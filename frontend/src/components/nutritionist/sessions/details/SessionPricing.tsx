import { IndianRupee } from "lucide-react";

import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

import { formatSessionPrice } from "./session-details.utils";

interface SessionPricingProps {
  pricingType: NutriSessionDetailsResponseDTO["pricingType"];
  pricing: NutriSessionDetailsResponseDTO["pricing"];
}

export default function SessionPricing({
  pricingType,
  pricing,
}: SessionPricingProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-5 w-1 rounded-full bg-emerald-600" />
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              Pricing
            </h2>
          </div>

          <p className="mt-1 pl-3.5 text-xs font-medium text-slate-500">
            Session access pricing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
            <IndianRupee className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {pricingType}
            </p>

            <p className="text-2xl font-extrabold tracking-tight text-slate-900">
              {formatSessionPrice(pricingType, pricing)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
