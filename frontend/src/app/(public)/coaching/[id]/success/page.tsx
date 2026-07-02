"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Sparkles, ArrowRight, Home, Calendar, Gift } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti animation after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleGoPlans = () => {
    router.push("/client/plans");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {showConfetti && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles
                  className="text-emerald-400 opacity-60"
                  size={16 + Math.random() * 16}
                />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Success Card */}
      <div className="relative bg-white shadow-2xl rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center border border-gray-200 animate-[slideUp_0.5s_ease-out]">
        {/* Success Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
            <CheckCircle className="text-white" size={56} strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Payment Successful!
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Thank you for your purchase. Your nutrition plan is now active and ready to transform your wellness journey.
        </p>

        {/* Features/Benefits */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8 border border-emerald-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Gift className="text-emerald-600" size={20} />
            What's Next?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Calendar className="text-emerald-600" size={24} />
              </div>
              <p className="font-semibold text-gray-900">Access Your Plan</p>
              <p className="text-gray-600 text-xs">Start following your personalized program</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="text-teal-600" size={24} />
              </div>
              <p className="font-semibold text-gray-900">Track Progress</p>
              <p className="text-gray-600 text-xs">Monitor your transformation journey</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <CheckCircle className="text-cyan-600" size={24} />
              </div>
              <p className="font-semibold text-gray-900">Get Support</p>
              <p className="text-gray-600 text-xs">Connect with your nutritionist</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoPlans}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            <span>View My Plans</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => router.push("/client/dashboard")}
            className="bg-white border-2 border-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:border-emerald-300 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Go to Dashboard</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
    </div>
  );
}

// Add this to your global CSS or tailwind.config.js
// @keyframes slideUp {
//   from {
//     opacity: 0;
//     transform: translateY(30px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }