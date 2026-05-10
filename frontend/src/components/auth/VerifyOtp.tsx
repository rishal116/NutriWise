"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { userAuthService } from "@/services/user/userAuth.service";
import { loginSuccess } from "@/redux/slices/authSlice";
import toast, { Toaster } from "react-hot-toast";
import { Mail, Shield, Clock, RotateCw, CheckCircle2 } from "lucide-react";
import { restoreSignupEmail, clearSignupEmail } from "@/redux/slices/signupSlice";
import axios from "axios";

// ─── Loading Overlay ──────────────────────────────────────────────────────────

function LoadingOverlay({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-label={message}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Spinner ring with brand icon */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-500 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <span className="text-xl" aria-hidden>🍃</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-base font-bold text-gray-800">{message}</p>
          <p className="text-sm text-gray-500 mt-1">Please wait a moment…</p>
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-teal-400"
              style={{ animation: `otp-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes otp-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── OTP Form ─────────────────────────────────────────────────────────────────

export default function OtpForm() {
  const email    = useSelector((state: RootState) => state.signup.email);
  const token    = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const router   = useRouter();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [otp, setOtp]             = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer]         = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // ── Redirects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (token) router.replace("/home");
  }, [token, router]);

  useEffect(() => {
    if (isVerifying) return;

    const storedEmail = localStorage.getItem("signupEmail");

    if (!email && storedEmail) {
      dispatch(restoreSignupEmail(storedEmail));
      return;
    }

    if (!email && !storedEmail) {
      router.replace("/signup");
    }
  }, [email, isVerifying, dispatch, router]);

  // ── Focus first input on mount ───────────────────────────────────────────────

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // ── Countdown timer ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // ── Input handlers ───────────────────────────────────────────────────────────

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp  = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "Backspace") return;

    e.preventDefault();
    const newOtp = [...otp];

    if (otp[index]) {
      newOtp[index] = "";
    } else if (index > 0) {
      newOtp[index - 1] = "";
      inputRefs.current[index - 1]?.focus();
    }

    setOtp(newOtp);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pasted.length, 6) - 1;
    inputRefs.current[lastIndex]?.focus();
  };

  // ── Verify ───────────────────────────────────────────────────────────────────

  const handleVerify = async () => {
    if (isVerifying) return;

    if (!email) {
      toast.error("Invalid session. Please sign up again.");
      router.replace("/signup");
      return;
    }

    try {
      setIsVerifying(true);
      const otpString = otp.join("");
      const res       = await userAuthService.verifyOtp(email, otpString);

      if (res.success) {
        dispatch(clearSignupEmail());
        localStorage.removeItem("signupEmail");
        toast.success(res.message || "OTP verified successfully!");

        if (res.accessToken) {
          dispatch(loginSuccess(res.accessToken));
        }

        setTimeout(() => router.replace("/client/profile-setup"), 1000);
      } else {
        toast.error(res.message || "Verification failed. Please try again.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Invalid OTP or OTP expired.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Resend ───────────────────────────────────────────────────────────────────

  const handleResend = async () => {
    if (!email) {
      toast.error("Session expired. Please sign up again.");
      router.replace("/signup");
      return;
    }

    try {
      setIsResending(true);
      const res = await userAuthService.resendOtp(email);
      toast.success(res.message || "OTP resent successfully!");

      setTimer(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to resend OTP.");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsResending(false);
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isOtpComplete = otp.every((d) => d !== "");
  const isBusy        = isVerifying || isResending;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      <Toaster />

      {/* Full-screen overlay — shown for either action */}
      {isVerifying && <LoadingOverlay message="Verifying your code…" />}
      {isResending && <LoadingOverlay message="Resending OTP…" />}

      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 border border-teal-100">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
              <span className="text-2xl" aria-hidden>🍃</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify Your Email</h1>
            <p className="text-gray-500 text-sm">We&apos;ve sent a 6-digit code to</p>
            <p className="text-teal-600 font-semibold text-sm mt-1 flex items-center justify-center gap-1">
              <Mail className="w-4 h-4" aria-hidden />
              {email}
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">
              Enter Verification Code
            </p>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={isBusy}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  className={[
                    "w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 rounded-xl transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    digit
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-gray-200 bg-gray-50 text-gray-900",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          {/* Timer Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" aria-hidden />
                <span>{timer > 0 ? `Code expires in ${formatTime(timer)}` : "Code expired"}</span>
              </div>
              <span className={`font-semibold tabular-nums ${timer > 20 ? "text-teal-600" : "text-red-500"}`}>
                {timer}s
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={[
                  "h-full rounded-full transition-all duration-1000 ease-linear",
                  timer > 20
                    ? "bg-gradient-to-r from-teal-400 to-emerald-500"
                    : "bg-red-400",
                ].join(" ")}
                style={{ width: `${(timer / 60) * 100}%` }}
              />
            </div>
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={!isOtpComplete || isBusy}
            className={[
              "w-full py-3.5 rounded-xl font-semibold text-white transition-all duration-200",
              "flex items-center justify-center gap-2 shadow-md",
              isOtpComplete && !isBusy
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-teal-200 hover:shadow-teal-300 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none",
            ].join(" ")}
          >
            <CheckCircle2 className="w-5 h-5" aria-hidden />
            Verify Code
          </button>

          {/* Resend Section */}
          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500 mb-2">{"Didn't receive the code?"}</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isBusy}
              className={[
                "inline-flex items-center gap-2 text-sm font-semibold transition-all",
                canResend && !isBusy
                  ? "text-teal-600 hover:text-emerald-600 cursor-pointer"
                  : "text-gray-300 cursor-not-allowed",
              ].join(" ")}
            >
              <RotateCw
                className={[
                  "w-4 h-4 transition-transform",
                  isResending ? "animate-spin" : "",
                  canResend && !isBusy ? "text-teal-500" : "text-gray-300",
                ].join(" ")}
                aria-hidden
              />
              {isResending ? "Sending…" : "Resend Code"}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 flex items-start gap-2.5 bg-teal-50 border border-teal-100 rounded-xl p-3.5">
            <Shield className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" aria-hidden />
            <p className="text-xs text-teal-700 leading-relaxed">
              For your security, this code will expire in 1 minute. Never share this code with anyone.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}