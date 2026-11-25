"use client";

import { useId } from "react";

import type { SessionPricingType } from "@/constants/common/session.constants";
import { SESSION_LIMITS } from "@/constants/common/session-limits.constants";

import {
  SESSION_ERROR_CLASS,
  SESSION_INPUT_CLASS,
  SESSION_LABEL_CLASS,
  SESSION_SECTION_LABEL_CLASS,
  SESSION_PRICING_OPTIONS,
} from "./session-form.constants";

import { FormError } from "./FormError";

interface PricingSectionProps {
  pricingType: SessionPricingType | "";
  amount: number;
  pricingTypeError?: string;
  priceError?: string;
  onPricingTypeChange: (type: SessionPricingType) => void;
  onAmountChange: (value: string) => void;
}

export function PricingSection({
  pricingType,
  amount,
  pricingTypeError,
  priceError,
  onPricingTypeChange,
  onAmountChange,
}: PricingSectionProps) {
  const ids = useId();

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className={SESSION_SECTION_LABEL_CLASS}>Pricing</h2>

      <div
        className="grid grid-cols-2 gap-3"
        role="radiogroup"
        aria-label="Session pricing"
        aria-describedby={
          pricingTypeError ? `${ids}-pricing-type-error` : undefined
        }
      >
        {SESSION_PRICING_OPTIONS.map((type) => (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={pricingType === type}
            onClick={() => onPricingTypeChange(type)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition ${
              pricingType === type
                ? "border-emerald-700 bg-emerald-50 text-emerald-800"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {type === "free" ? "Free session" : "Paid session"}
          </button>
        ))}
      </div>

      <FormError message={pricingTypeError} id={`${ids}-pricing-type-error`} />

      {pricingType === "free" ? (
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            Free session · ₹0
          </p>

          <p className="mt-1 text-xs text-emerald-800">
            No payment is required from participants.
          </p>
        </div>
      ) : pricingType === "paid" ? (
        <div>
          <label htmlFor={`${ids}-price`} className={SESSION_LABEL_CLASS}>
            Price (INR)
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
              ₹
            </span>

            <input
              id={`${ids}-price`}
              type="number"
              min={SESSION_LIMITS.priceMin}
              max={SESSION_LIMITS.priceMax}
              step={1}
              value={Number.isNaN(amount) || amount === 0 ? "" : amount}
              onChange={(event) => onAmountChange(event.target.value)}
              aria-invalid={!!priceError}
              aria-describedby={
                priceError
                  ? `${ids}-price-hint ${ids}-price-error`
                  : `${ids}-price-hint`
              }
              className={`${SESSION_INPUT_CLASS} pl-8 ${
                priceError ? SESSION_ERROR_CLASS : ""
              }`}
              placeholder="500"
            />
          </div>

          <p id={`${ids}-price-hint`} className="mt-1.5 text-xs text-slate-400">
            ₹{SESSION_LIMITS.priceMin}–₹
            {SESSION_LIMITS.priceMax.toLocaleString("en-IN")} per participant.
            INR only.
          </p>

          <FormError message={priceError} id={`${ids}-price-error`} />
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          Select whether this session is free or paid.
        </p>
      )}
    </section>
  );
}
