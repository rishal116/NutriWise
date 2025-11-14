"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { userAuthService } from "@/services/user/user.service";
import { setUserEmailAndRole } from "@/redux/slices/authSlice";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionist.service";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Shield, Clock, RotateCw, CheckCircle2 } from "lucide-react";

export default function OtpForm() {
  const { email, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);


 useEffect(() => {
    if (!email || !role) {
      const storedUser = sessionStorage.getItem("tempUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.email && parsed?.role) {
          dispatch(setUserEmailAndRole(parsed));
          return;
        }
      }

      toast.error("Session expired. Please sign up again.");
      router.replace("/signup");
    }
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        newOtp[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      }
      setOtp(newOtp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const lastFilledIndex = Math.min(pastedData.length, 6) - 1;
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!email || !role) {
      toast.error("Invalid session. Please sign up again.");
      router.replace(`/signup`);
      return;
    }

    try {
      setIsVerifying(true);
      const otpString = otp.join("");
      const res = await userAuthService.verifyOtp(email, otpString)

      if (res.success) {
        toast.success(res.message || "OTP verified successfully!");

        if (res.accessToken) {
          localStorage.setItem("token", res.accessToken);
        }

        setTimeout(() => {
          if (res.role === "nutritionist") router.replace("/nutritionist/details");
          else router.replace("/home");
        }, 1000);
      } else {
        toast.error(res.message || "Verification failed. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP or OTP expired.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || !role) {
      toast.error("Invalid session. Please sign up again.");
      router.replace(`/signup`);
      return;
    }

    try {
      const res = await userAuthService.resendOtp(email);

      toast.success(res.message || "OTP resent successfully!");
      setTimer(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isOtpComplete = otp.every(d => d !== "");

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12 sm:py-16 lg:py-20">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 lg:p-10 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-4xl">🍃</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              We've sent a 6-digit code to
            </p>
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-700 text-sm sm:text-base">{email}</span>
            </div>
          </div>

          {/* OTP Inputs */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
              Enter Verification Code
            </label>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => { inputRefs.current[i] = el }}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl transition-all ${
                    digit 
                      ? "border-green-500 bg-green-50 text-green-700" 
                      : "border-gray-200 bg-gray-50 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                />
              ))}
            </div>
          </div>

          {/* Timer Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="font-medium">
                  {timer > 0 ? `Code expires in ${formatTime(timer)}` : "Code expired"}
                </span>
              </div>
              <span className={`text-sm font-semibold ${timer > 20 ? "text-green-600" : "text-red-500"}`}>
                {timer}s
              </span>
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full transition-all duration-1000 rounded-full ${
                  timer > 20 ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${(timer / 60) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!isOtpComplete || timer <= 0 || isVerifying}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isVerifying ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify Code</span>
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Resend Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
            <button
              disabled={!canResend}
              onClick={handleResend}
              className={`inline-flex items-center gap-2 text-sm font-semibold transition-all ${
                canResend 
                  ? "text-green-600 hover:text-green-700 hover:underline" 
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <RotateCw className={`w-4 h-4 ${canResend ? "" : "opacity-50"}`} />
              Resend Code
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-start gap-3 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p>
                For your security, this code will expire in 1 minute. 
                Never share this code with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}