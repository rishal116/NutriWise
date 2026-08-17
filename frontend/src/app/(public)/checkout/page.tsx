"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nutritionistPlanBrowsingService } from "@/services/user/nutriPanBrowsing.service";
import { checkoutService } from "@/services/user/checkout.service";
import type { NutritionistPlanDTO } from "@/dtos/user/nutri-plan-browsing/nutri-plan.dto";
import { PLATFORM_FEATURES } from "@/constants/platform-features";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Lock,
  Shield,
  CreditCard,
  ArrowLeft,
  Calendar,
  AlertCircle,
  IndianRupee,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

function formatPrice(price: number, currency: NutritionistPlanDTO["currency"]) {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function CurrencyIcon({
  currency,
  size,
  className,
  strokeWidth,
}: {
  currency: NutritionistPlanDTO["currency"];
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return currency === "INR" ? (
    <IndianRupee size={size} className={className} strokeWidth={strokeWidth} />
  ) : (
    <DollarSign size={size} className={className} strokeWidth={strokeWidth} />
  );
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("plan");

  const [plan, setPlan] = useState<NutritionistPlanDTO | null>(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingPlan, setFetchingPlan] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await nutritionistPlanBrowsingService.getPlanBySlug(
          slug as string,
        );

        if (res) {
          setPlan(res);
        } else {
          setError("Plan not found");
        }
      } catch {
        setError("Failed to load plan details");
      } finally {
        setFetchingPlan(false);
      }
    }
    if (slug) fetchPlan();
  }, [slug]);

  /* ── ERROR STATE ── */
  if (!fetchingPlan && error && !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-rose-200 max-w-sm w-full">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-5 mx-auto">
            <AlertCircle className="text-rose-600" size={32} />
          </div>
          <p className="text-rose-600 font-bold text-lg mb-5">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ── LOADING STATE ── */
  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent" />
          <p className="text-emerald-700 font-semibold text-sm tracking-wide">
            Securing your session…
          </p>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!agree) return;

    try {
      setLoading(true);
      setError(null);

      const response = await checkoutService.createSession({
        planId: plan.id,
      });

      if (response.success && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("Checkout URL missing");
      }
    } catch (error) {
      console.log(error);
      setError("Payment initialization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const perDay = (plan.price / plan.durationDays).toFixed(0);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* ── STICKY HEADER ── */}
      <div className="bg-white border-b border-slate-200/80 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 transition-colors duration-150 mb-1.5 group font-medium"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform duration-200 flex-shrink-0"
              />
              Back to Plans
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Checkout
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            <Lock size={13} className="text-emerald-600 flex-shrink-0" />
            Secure Encrypted
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* ── LEFT — ORDER SUMMARY ── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Order summary card */}
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
              {/* Card header */}
              <div className="bg-emerald-50 px-6 py-4 border-b border-slate-200/80 flex items-center gap-3">
                <div className="w-1 h-5 bg-emerald-600 rounded-full flex-shrink-0" />
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Plan info block */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="min-w-0">
                      <h3 className="font-bold tracking-tight text-xl text-slate-900 leading-snug mb-1 truncate">
                        {plan.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                        <Calendar
                          size={14}
                          className="text-emerald-600 flex-shrink-0"
                        />
                        <span>{plan.durationDays}-Day Programme Access</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                      Active
                    </span>
                  </div>

                  {/* Features grid */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Programme Highlights
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {plan.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-slate-600"
                        >
                          <CheckCircle
                            size={14}
                            className="text-emerald-600 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm font-medium leading-snug">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform features — included with every plan */}
                  <div className="mt-5 pt-5 border-t border-slate-200/80">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Also Included With Every Plan
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PLATFORM_FEATURES.map((f) => (
                        <div
                          key={f}
                          className="flex items-start gap-2 text-slate-500"
                        >
                          <CheckCircle
                            size={14}
                            className="text-emerald-600 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-xs font-medium leading-snug">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
                    <span>Base Programme Price</span>
                    <span className="flex items-center text-slate-800 font-bold">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
                    <span>Platform &amp; Secure Processing</span>
                    <span className="text-emerald-700 text-[10px] font-semibold uppercase tracking-wider">
                      Free
                    </span>
                  </div>

                  <div className="h-px bg-slate-200/80" />

                  {/* Total row */}
                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                        Total Payable
                      </p>
                      <p className="text-xs text-emerald-700 font-semibold flex items-center gap-0.5">
                        ≈ {formatPrice(Number(perDay), plan.currency)} / day
                      </p>
                    </div>
                    <div className="flex items-center text-3xl font-bold text-emerald-700">
                      <CurrencyIcon
                        currency={plan.currency}
                        size={26}
                        className="text-emerald-700 flex-shrink-0"
                        strokeWidth={3}
                      />
                      {plan.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee banner — solid dark panel, matching the "Success Highlights" pattern */}
            <div className="bg-emerald-950 rounded-2xl p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/20 border border-emerald-400/30 p-3 rounded-xl flex-shrink-0">
                  <Shield className="text-emerald-400" size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1.5">
                    Client Satisfaction Promise
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    We are committed to helping you achieve real results with
                    expert guidance and continuous support throughout your
                    journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT — PAYMENT ACTION ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-7 sticky top-24 space-y-6">
              {/* Panel heading */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={17} />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                  Final Step
                </h2>
              </div>

              {/* Stripe trust box */}
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Lock
                    className="text-sky-700 flex-shrink-0"
                    size={13}
                    strokeWidth={3}
                  />
                  <span className="font-semibold text-sky-900 text-[10px] uppercase tracking-wider">
                    Stripe Secure
                  </span>
                </div>
                <p className="text-xs text-sky-800/80 font-medium leading-relaxed">
                  {`You'll be redirected to Stripe to complete your purchase. We
                  never store your card details.`}
                </p>
              </div>

              <label className="group flex cursor-pointer items-start gap-3 rounded-xl border-2 border-slate-200/80 p-4 transition-colors duration-150 hover:border-emerald-300">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />

                <span className="text-xs font-medium leading-relaxed text-slate-500 group-hover:text-slate-700">
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

              {/* Inline error */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5">
                  <AlertCircle
                    className="text-rose-600 flex-shrink-0 mt-0.5"
                    size={14}
                  />
                  <p className="text-xs text-rose-700 font-semibold leading-snug">
                    {error}
                  </p>
                </div>
              )}

              {/* Pay button */}
              <button
                disabled={!agree || loading}
                onClick={handleCheckout}
                className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  agree && !loading
                    ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs hover:shadow-lg hover:-translate-y-0.5"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Pay</span>
                    <span className="flex items-center gap-0.5">
                      <CurrencyIcon
                        currency={plan.currency}
                        size={16}
                        strokeWidth={3}
                        className="flex-shrink-0"
                      />
                      {plan.price.toLocaleString()}
                    </span>
                  </>
                )}
              </button>

              {/* Card brand pills */}
              <div className="flex items-center justify-center gap-3 opacity-40 hover:opacity-70 transition-opacity duration-150">
                {["VISA", "MASTERCARD", "UPI"].map((brand) => (
                  <div
                    key={brand}
                    className="text-[9px] font-semibold border border-slate-300 px-2 py-0.5 rounded tracking-wider text-slate-500"
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
