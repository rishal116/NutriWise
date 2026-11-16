import { Calendar, CheckCircle } from "lucide-react";

import { PLATFORM_FEATURES } from "@/constants/common/platform-features";
import type { NutritionistPlanDTO } from "@/dtos/user/nutri-plan-browsing/nutri-plan.dto";

import { formatPrice, CurrencyIcon } from "./checkout.utils";

interface CheckoutOrderSummaryProps {
  plan: NutritionistPlanDTO;
}

export default function CheckoutOrderSummary({
  plan,
}: CheckoutOrderSummaryProps) {
  const perDay = plan.price / plan.durationDays;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="flex items-center gap-3 border-b border-slate-200/80 bg-emerald-50 px-6 py-4">
        <div className="h-5 w-1 shrink-0 rounded-full bg-emerald-600" />
        <h2 className="text-base font-bold tracking-tight text-slate-900">
          Order Summary
        </h2>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-5">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="mb-1 truncate text-xl leading-snug font-bold tracking-tight text-slate-900">
                {plan.title}
              </h3>

              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Calendar size={14} className="shrink-0 text-emerald-600" />
                <span>{plan.durationDays}-Day Programme Access</span>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
              Available
            </span>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Programme Highlights
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2 text-slate-600"
                >
                  <CheckCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <span className="text-sm leading-snug font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-200/80 pt-5">
            <p className="mb-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Also Included With Every Plan
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {PLATFORM_FEATURES.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-2 text-slate-500"
                >
                  <CheckCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <span className="text-xs leading-snug font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Base Programme Price</span>
            <span className="font-bold text-slate-800">
              {formatPrice(plan.price)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>Platform &amp; Secure Processing</span>
            <span className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
              Free
            </span>
          </div>

          <div className="h-px bg-slate-200/80" />

          <div className="flex items-end justify-between pt-1">
            <div>
              <p className="mb-0.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Total Payable
              </p>
              <p className="flex items-center gap-0.5 text-xs font-semibold text-emerald-700">
                ≈ {formatPrice(perDay)} / day
              </p>
            </div>

            <div className="flex items-center text-3xl font-bold text-emerald-700">
              <CurrencyIcon
                size={26}
                className="mr-1 shrink-0"
                strokeWidth={3}
              />
              {plan.price.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
