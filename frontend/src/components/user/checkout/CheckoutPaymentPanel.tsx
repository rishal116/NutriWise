
"use client";

import { CreditCard, Lock } from "lucide-react";
import Link from "next/link";

import type { NutritionistPlanDTO } from "@/dtos/user/nutri-plan-browsing/nutri-plan.dto";

import { CurrencyIcon, formatPrice } from "./checkout.utils";

interface CheckoutPaymentPanelProps {
  plan: NutritionistPlanDTO;
  agree: boolean;
  loading: boolean;
  onAgreeChange: (checked: boolean) => void;
  onCheckout: () => void;
}

const PAYMENT_BRANDS = ["VISA", "MASTERCARD"];

export default function CheckoutPaymentPanel({
  plan,
  agree,
  loading,
  onAgreeChange,
  onCheckout,
}: CheckoutPaymentPanelProps) {
  return (
    <section className="sticky top-24 space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
          <CreditCard size={17} />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Final Step
        </h2>
      </div>

      <div className="space-y-1.5 rounded-xl border border-sky-200 bg-sky-50 p-4">
        <div className="flex items-center gap-2">
          <Lock
            className="shrink-0 text-sky-700"
            size={13}
            strokeWidth={3}
          />

          <span className="text-[10px] font-semibold tracking-wider text-sky-900 uppercase">
            Stripe Secure
          </span>
        </div>

        <p className="text-xs leading-relaxed font-medium text-sky-800/80">
          You&apos;ll be redirected to Stripe to complete your purchase. We
          never store your card details.
        </p>
      </div>

      <label className="group flex cursor-pointer items-start gap-3 rounded-xl border-2 border-slate-200/80 p-4 transition-colors duration-150 hover:border-emerald-300">
        <input
          type="checkbox"
          checked={agree}
          onChange={(event) => onAgreeChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />

        <span className="text-xs leading-relaxed font-medium text-slate-500 group-hover:text-slate-700">
          I agree to the{" "}
          <Link
            href="/terms-of-service"
            className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/refund-policy"
            className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
          >
            Refund Policy
          </Link>
          .
        </span>
      </label>

      <button
        type="button"
        disabled={!agree || loading}
        onClick={onCheckout}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all duration-300 ${
          agree && !loading
            ? "bg-emerald-700 text-white shadow-xs hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg"
            : "cursor-not-allowed bg-slate-100 text-slate-400"
        }`}
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            <span>Pay</span>

            <span className="flex items-center gap-1">
              <CurrencyIcon size={16} strokeWidth={3} />
              {formatPrice(plan.price)}
            </span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-3 opacity-40 transition-opacity duration-150 hover:opacity-70">
        {PAYMENT_BRANDS.map((brand) => (
          <span
            key={brand}
            className="rounded border border-slate-300 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-slate-500"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
