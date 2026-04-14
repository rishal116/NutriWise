"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { nutritionistListService } from "@/services/user/nutritionistList.service";
import { checkoutService } from "@/services/user/checkout.service";
import {
  CheckCircle,
  Lock,
  Shield,
  CreditCard,
  ArrowLeft,
  Calendar,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

interface Plan {
  id: string;
  title: string;
  durationInDays: number;
  price: number;
  features: string[];
}

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");

  const [plan, setPlan] = useState<Plan | null>(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await nutritionistListService.getPlans(id as string);
        const selected = res?.data?.find((p: Plan) => p.id === planId);
        if (selected) {
          setPlan(selected);
        } else {
          setError("Plan not found");
        }
      } catch {
        setError("Failed to load plan details");
      }
    }
    if (planId) fetchPlan();
  }, [id, planId]);

  /* ── ERROR STATE ── */
  if (error && !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-100 max-w-sm w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-5 mx-auto">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <p className="text-red-600 font-bold text-lg mb-5">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center space-y-4">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent" />
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
      const data = await checkoutService.createSession({
        planId: plan.id,
        nutritionistId: id as string,
      });
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Payment initialisation failed. Please try again.");
      setLoading(false);
    }
  };

  const perDay = (plan.price / plan.durationInDays).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-20 font-sans">
      {/* ── STICKY HEADER ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-1.5 group font-medium"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform duration-200 flex-shrink-0"
              />
              Back to Plans
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent leading-tight">
              Checkout
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <Lock size={13} className="text-emerald-500 flex-shrink-0" />
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Card header */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-1 h-5 bg-emerald-500 rounded-full flex-shrink-0" />
                <h2 className="text-base font-extrabold text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Plan info block */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-xl text-gray-900 leading-snug mb-1 truncate">
                        {plan.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                        <Calendar
                          size={14}
                          className="text-emerald-500 flex-shrink-0"
                        />
                        <span>{plan.durationInDays}-Day Programme Access</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      Active
                    </span>
                  </div>

                  {/* Features grid */}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                      Programme Highlights
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {plan.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle
                            size={14}
                            className="text-emerald-500 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-sm font-medium leading-snug">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                    <span>Base Programme Price</span>
                    <span className="flex items-center text-gray-800 font-bold">
                      <IndianRupee
                        size={14}
                        strokeWidth={2.5}
                        className="flex-shrink-0"
                      />
                      {plan.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                    <span>Platform &amp; Secure Processing</span>
                    <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                      Free
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Total row */}
                  <div className="flex items-end justify-between pt-1">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                        Total Payable
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
                        ≈
                        <IndianRupee size={11} className="flex-shrink-0" />
                        {perDay} / day
                      </p>
                    </div>
                    <div className="flex items-center text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                      <IndianRupee
                        size={26}
                        className="text-emerald-600 flex-shrink-0"
                        strokeWidth={3}
                      />
                      {plan.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee banner */}
            <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
              <div className="relative flex items-start gap-4">
                <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-500/30 flex-shrink-0">
                  <Shield className="text-emerald-400" size={22} />
                </div>
                <div>
                  <h3>Client Satisfaction Promise</h3>
                  <p>
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
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-7 sticky top-24 space-y-6">
              {/* Panel heading */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                  <CreditCard className="text-emerald-600" size={18} />
                </div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  Final Step
                </h2>
              </div>

              {/* Stripe trust box */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Lock
                    className="text-emerald-600 flex-shrink-0"
                    size={13}
                    strokeWidth={3}
                  />
                  <span className="font-black text-emerald-900 text-[10px] uppercase tracking-widest">
                    Stripe Secure
                  </span>
                </div>
                <p className="text-xs text-emerald-800/70 font-medium leading-relaxed">
                  {`You'll be redirected to Stripe to complete your purchase. We
                  never store your card details.`}
                </p>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-emerald-200 transition-colors group">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0"
                />
                <span className="text-xs text-gray-500 font-medium leading-relaxed group-hover:text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-emerald-600 underline underline-offset-2 font-semibold"
                  >
                    Terms of Service
                  </a>{" "}
                  &amp;{" "}
                  <a
                    href="#"
                    className="text-emerald-600 underline underline-offset-2 font-semibold"
                  >
                    Refund Policy
                  </a>
                  .
                </span>
              </label>

              {/* Inline error */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-start gap-2.5">
                  <AlertCircle
                    className="text-red-500 flex-shrink-0 mt-0.5"
                    size={14}
                  />
                  <p className="text-xs text-red-700 font-semibold leading-snug">
                    {error}
                  </p>
                </div>
              )}

              {/* Pay button */}
              <button
                disabled={!agree || loading}
                onClick={handleCheckout}
                className={`w-full py-4 rounded-xl font-black text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  agree && !loading
                    ? "bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Pay</span>
                    <span className="flex items-center gap-0.5">
                      <IndianRupee
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
              <div className="flex items-center justify-center gap-3 opacity-30 hover:opacity-60 transition-opacity">
                {["VISA", "MASTERCARD", "UPI"].map((brand) => (
                  <div
                    key={brand}
                    className="text-[9px] font-black border border-gray-400 px-2 py-0.5 rounded tracking-widest text-gray-600"
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
