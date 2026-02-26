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
  Sparkles, 
  AlertCircle,
  IndianRupee 
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="text-red-600" size={40} />
          </div>
          <p className="text-red-600 font-bold text-xl mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
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
          <p className="text-emerald-700 font-bold tracking-tight">Securing your session...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-20 font-sans">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200/60 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors mb-2 group font-bold text-sm"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Plans</span>
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Checkout
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
            <Lock size={14} className="text-emerald-500" />
            Secure Encrypted
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* LEFT — ORDER SUMMARY */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-emerald-900/5 border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 px-8 py-6 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                  Order Summary
                </h2>
              </div>

              <div className="p-8">
                {/* Plan Card */}
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 mb-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-black text-2xl text-gray-900 mb-2">{plan.title}</h3>
                      <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                        <Calendar size={16} className="text-emerald-600" />
                        <span>{plan.durationInDays} Days Program Access</span>
                      </div>
                    </div>
                    <div className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                      Active
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Program Highlights</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-600">
                          <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                          <span className="text-sm font-medium leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center text-gray-500 font-bold">
                    <span>Base Program Price</span>
                    <span className="flex items-center text-gray-900">
                      <IndianRupee size={16} strokeWidth={2.5} />
                      {plan.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-bold">
                    <span>Platform & Secure Processing</span>
                    <span className="text-emerald-600 uppercase text-xs tracking-widest font-black">Free</span>
                  </div>
                  
                  <div className="h-px bg-gray-100 my-4"></div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-sm font-black text-gray-400 uppercase tracking-tighter">Total Payable</span>
                      <p className="text-sm text-emerald-600 font-bold">
                        ≈ <IndianRupee size={12} className="inline" />{(plan.price / plan.durationInDays).toFixed(0)} / day
                      </p>
                    </div>
                    <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center">
                      <IndianRupee size={32} className="text-emerald-600 mr-1" strokeWidth={3} />
                      {plan.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30">
                  <Shield className="text-emerald-400" size={28} />
                </div>
                <div>
                  <h3 className="font-black text-xl mb-2">30-Day Happiness Guarantee</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">
                    We're confident in our transformation plans. If you're not satisfied within your first 30 days, we'll refund your investment in full—no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — PAYMENT ACTION */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-900/10 border border-gray-100 p-8 sticky top-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <CreditCard className="text-emerald-600" size={20} />
                </div>
                <h2 className="text-xl font-black text-gray-900">Final Step</h2>
              </div>

              {/* Stripe Trust Box */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="text-emerald-600" size={16} strokeWidth={3} />
                  <span className="font-black text-emerald-900 text-xs uppercase tracking-widest">Stripe Secure</span>
                </div>
                <p className="text-xs text-emerald-800/70 font-bold leading-relaxed">
                  You will be redirected to Stripe to complete your purchase. We never store your card details.
                </p>
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-3 p-5 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-emerald-200 transition-all mb-8 group">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
                />
                <span className="text-xs text-gray-500 font-bold leading-normal group-hover:text-gray-700">
                  I agree to the <a href="#" className="text-emerald-600 underline">Terms of Service</a> & <a href="#" className="text-emerald-600 underline">Refund Policy</a>.
                </span>
              </label>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-red-800 font-bold">{error}</p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                disabled={!agree || loading}
                onClick={handleCheckout}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                  agree && !loading
                    ? "bg-gray-900 text-white hover:bg-emerald-600 hover:shadow-emerald-200 hover:scale-[1.02] active:scale-95"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Pay </span>
                    <div className="flex items-center">
                      <IndianRupee size={20} strokeWidth={3} />
                      {plan.price.toLocaleString()}
                    </div>
                  </>
                )}
              </button>

              <div className="mt-8 flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                <div className="text-[10px] font-black border border-gray-400 px-2 py-1 rounded">VISA</div>
                <div className="text-[10px] font-black border border-gray-400 px-2 py-1 rounded">MASTERCARD</div>
                <div className="text-[10px] font-black border border-gray-400 px-2 py-1 rounded">UPI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}