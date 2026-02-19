"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userAuthService } from "@/services/user/userAuth.service";
import { Clock, RefreshCw, ChevronLeft, ShieldCheck, Mail } from "lucide-react";

export default function PendingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    try {
      setChecking(true);
      const res = await userAuthService.getMe();

      if (!res?.user) {
        router.replace("/");
        return;
      }

      const status = res.user.nutritionistStatus;

      if (status === "approved") {
        router.replace("/nutritionist/dashboard");
        return;
      }

      if (status === "rejected") {
        router.replace("/nutritionist/reapply");
        return;
      }

      if (status === "none") {
        router.replace("/nutritionist/details");
        return;
      }
    } catch (err) {
      console.error("Failed to check status", err);
      router.replace("/");
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin"></div>
          <Clock className="absolute text-teal-600 w-6 h-6" />
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Verifying credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-12 sm:py-20 bg-slate-50 overflow-y-auto">
      
      {/* Container Card */}
      <div className="w-full max-w-md bg-white shadow-[0_20px_50px_rgba(13,148,136,0.08)] rounded-[2.5rem] overflow-hidden border border-teal-50 my-auto">
        
        {/* Animated Top Header - Teal-to-Green Gradient */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-br from-teal-600 to-green-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>
          <div className="relative bg-white/20 p-3 sm:p-4 rounded-full backdrop-blur-md">
            <ShieldCheck className="text-white w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
          </div>
        </div>
        
        <div className="p-6 sm:p-10 text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              Step 2 of 3: Verification
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">Almost There!</h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed px-2">
              Our medical board is currently reviewing your application. This usually takes 
              <span className="text-slate-900 font-semibold text-base block mt-1 underline decoration-green-400 decoration-2 underline-offset-4">
                Up to 48 Hours
              </span>
            </p>
          </div>

          {/* Timeline Section */}
          <div className="bg-slate-50 rounded-[2rem] p-5 sm:p-6 mb-8 border border-teal-50/50">
            <div className="flex justify-between items-center mb-6">
              <div className="text-left">
                <p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest">Application</p>
                <p className="text-xs sm:text-sm font-bold text-teal-600 italic">Under Review</p>
              </div>
              <button 
                onClick={checkStatus}
                disabled={checking}
                title="Refresh Status"
                className="p-2 sm:p-2.5 rounded-xl bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-teal-600 ${checking ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-teal-500" />
                  <div className="absolute top-2.5 left-1 w-[2px] h-6 bg-teal-100" />
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-700 text-left">Details Submitted</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                   <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 animate-ping absolute" />
                   <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 relative" />
                   <div className="absolute top-2.5 left-1 w-[2px] h-6 bg-slate-200" />
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-teal-700 text-left">Credential Verification</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-300" />
                <p className="text-[11px] sm:text-xs font-semibold text-slate-400 text-left">Portal Activation</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={() => router.push("/home")}
              className="w-full flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-teal-900 text-white rounded-2xl font-bold text-sm sm:text-base hover:bg-teal-800 transition-all shadow-xl shadow-teal-900/10 active:scale-[0.98]"
            >
              <ChevronLeft size={18} />
              Return to Homepage
            </button>
            
            <div className="flex items-center justify-center gap-1.5 pt-2">
                <Mail size={14} className="text-slate-400" />
                <p className="text-[10px] sm:text-[11px] text-slate-400">
                  Questions? <a href="mailto:support@example.com" className="text-teal-600 underline font-medium hover:text-green-600 transition-colors">Contact Support</a>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}