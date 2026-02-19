"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { nutritionistListService } from "@/services/user/nutritionistList.service";
import { checkoutService } from "@/services/user/checkout.service";
import { CheckCircle, Lock, Shield, CreditCard, ArrowLeft, Calendar, Sparkles, AlertCircle } from "lucide-react";

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="text-emerald-600 hover:underline font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent mb-4"></div>
          <p className="text-emerald-700 font-semibold">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const handleCheckout = async () => {
    if (!agree) return;

    try {
      setLoading(true);
      setError(null);
      const data = await checkoutService.createSession(plan.id, id as string);
      window.location.href = data.url;
    } catch {
      setError("Payment initialization failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Plans</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
              <CreditCard className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Complete your purchase and start your transformation journey
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Security Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Shield className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Secure & Encrypted Payment</h3>
            <p className="text-sm text-blue-700">
              Your payment information is protected with bank-level 256-bit SSL encryption
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT — ORDER SUMMARY */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                  Order Summary
                </h2>
              </div>

              <div className="p-8">
                {/* Plan Details */}
                <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{plan.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} className="text-emerald-600" />
                        <span>{plan.durationInDays} days program</span>
                      </div>
                    </div>
                    <div className="bg-emerald-100 px-4 py-2 rounded-lg">
                      <span className="text-emerald-700 font-bold">Selected</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-emerald-600" />
                      What's Included
                    </h4>
                    <ul className="space-y-2.5">
                      {plan.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Plan Price</span>
                    <span className="font-semibold"> {plan.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Processing Fee</span>
                    <span className="font-semibold"> 0</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Payable</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                         {plan.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ≈ {(plan.price / plan.durationInDays).toFixed(2)} per day
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">30-Day Money Back Guarantee</h3>
                  <p className="text-emerald-50 text-sm">
                    Not satisfied? Get a full refund within 30 days, no questions asked. Your satisfaction is our priority.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — PAYMENT */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Lock size={20} className="text-emerald-600" />
                Payment
              </h2>

              {/* Stripe Badge */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Lock className="text-emerald-600" size={18} />
                  </div>
                  <span className="font-bold text-emerald-900">Secured by Stripe</span>
                </div>
                <p className="text-sm text-emerald-800">
                  Industry-leading payment security trusted by millions worldwide
                </p>
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors mb-6 group">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I agree to the{" "}
                  <a href="#" className="text-emerald-600 hover:underline font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-emerald-600 hover:underline font-medium">
                    Privacy Policy
                  </a>
                </span>
              </label>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                disabled={!agree || loading}
                onClick={handleCheckout}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                  agree && !loading
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-xl hover:scale-[1.02]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Redirecting to Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Proceed to Secure Payment</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You will be redirected to Stripe's secure checkout page
              </p>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">We accept</p>
                <div className="flex items-center justify-center gap-3 opacity-60">
                  <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold text-gray-600">VISA</div>
                  <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold text-gray-600">Mastercard</div>
                  <div className="bg-gray-100 px-3 py-2 rounded text-xs font-semibold text-gray-600">Amex</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="text-emerald-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-600">256-bit SSL encryption</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="text-teal-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Instant Access</h3>
            <p className="text-sm text-gray-600">Start immediately after payment</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="text-cyan-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Privacy Protected</h3>
            <p className="text-sm text-gray-600">Your data is safe with us</p>
          </div>
        </div>
      </div>
    </div>
  );
}