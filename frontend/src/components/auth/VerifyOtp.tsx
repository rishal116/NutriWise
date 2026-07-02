"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { userAuthService } from "@/services/user/userAuth.service";
import { loginSuccess } from "@/redux/slices/authSlice";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  Shield,
  Clock,
  RotateCw,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  restoreSignupEmail,
  clearSignupEmail,
} from "@/redux/slices/signupSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { verifyOtpSchema } from "@/validations/auth.validation";
import Logo from "../common/Logo";

export default function OtpForm() {
  const email = useSelector((state: RootState) => state.signup.email);
  const dispatch = useDispatch();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (isVerifying || isVerified) return;

    const storedEmail = localStorage.getItem("signupEmail");

    if (!email && storedEmail) {
      dispatch(restoreSignupEmail(storedEmail));
      return;
    }

    if (!email && !storedEmail) {
      router.replace("/signup");
    }
  }, [email, isVerifying, isVerified, dispatch, router]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const isOtpComplete = otp.every((d) => d !== "");
  const isExpired = timer <= 0;

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      if (otpError) setOtpError("");
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
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

  const handleVerify = useCallback(async () => {
    if (isVerifying) return;

    if (!email) {
      toast.error("Invalid session. Please sign up again.");
      router.replace("/signup");
      return;
    }

    if (isExpired) {
      setOtpError("Code expired. Please resend a new code.");
      return;
    }

    const otpValue = otp.join("");
    const validation = verifyOtpSchema.safeParse({ email, otp: otpValue });

    if (!validation.success) {
      setOtpError(validation.error.issues[0]?.message || "Invalid code");
      return;
    }

    setOtpError("");

    try {
      setIsVerifying(true);

      const res = await userAuthService.verifyOtp({
        email,
        otp: otpValue,
      });

      if (!res.success) {
        toast.error(res.message || "Verification failed. Please try again.");
        return;
      }

      setIsVerified(true);

      toast.success(res.message || "OTP verified successfully!");

      if (res.accessToken) {
        dispatch(loginSuccess(res.accessToken));
      }

      setTimeout(() => {
        dispatch(clearSignupEmail());
        localStorage.removeItem("signupEmail");

        if (!res.isProfileCompleted) {
          router.replace("/complete-profile");
          return;
        }

        switch (res.activeRole) {
          case "admin":
            router.replace("/admin");
            break;
          default:
            router.replace("/");
        }
      }, 1000);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  }, [email, otp, isVerifying, isExpired, dispatch, router]);

  useEffect(() => {
    if (isOtpComplete && !isExpired && !isVerifying) {
      handleVerify();
    }
  }, [isOtpComplete, isExpired, isVerifying, handleVerify]);

  const handleResend = useCallback(async () => {
    if (!email) {
      toast.error("Session expired. Please sign up again.");
      router.replace("/signup");
      return;
    }
    if (isResending) return;
    try {
      setIsResending(true);
      const res = await userAuthService.resendOtp({ email });
      toast.success(res.message || "OTP resent successfully!");
      setTimer(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      setOtpError("");
      inputRefs.current[0]?.focus();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  }, [email, isResending, router]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center bg-emerald-50/60 px-4 py-10 sm:py-14">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl shadow-emerald-900/10 border border-emerald-100 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <Logo size="large" linkable={false} />
              <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight mt-5">
                Verify your email
              </h1>
              <p className="text-gray-500 text-sm mt-1.5">
                We&apos;ve sent a 6-digit code to
              </p>
              <p className="text-emerald-600 font-semibold text-sm mt-1 flex items-center justify-center gap-1.5">
                <Mail className="w-4 h-4" />
                {email}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">
                Enter verification code
              </p>
              <div
                className="flex justify-center gap-2 sm:gap-3"
                onPaste={handlePaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={isVerifying}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border rounded-xl transition-all disabled:opacity-60 ${
                      otpError
                        ? "border-red-400 bg-red-50 text-red-600"
                        : digit
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-gray-50 text-gray-900"
                    } focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500`}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-red-500 text-xs text-center mt-2.5">
                  {otpError}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {timer > 0
                      ? `Code expires in ${formatTime(timer)}`
                      : "Code expired"}
                  </span>
                </div>
                <span
                  className={`font-semibold tabular-nums ${timer > 20 ? "text-emerald-600" : "text-red-500"}`}
                >
                  {timer}s
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                    timer > 20 ? "bg-emerald-500" : "bg-red-400"
                  }`}
                  style={{ width: `${(timer / 60) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={!isOtpComplete || isVerifying || isExpired}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-colors flex justify-center items-center gap-2 shadow-sm shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Verify Code <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-5 text-center">
              <p className="text-sm text-gray-500 mb-2">
                {"Didn't receive the code?"}
              </p>
              <button
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                  canResend && !isResending
                    ? "text-emerald-600 hover:text-emerald-700 cursor-pointer"
                    : "text-gray-300 cursor-not-allowed"
                }`}
              >
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCw
                    className={`w-4 h-4 ${canResend ? "text-emerald-500" : "text-gray-300"}`}
                  />
                )}
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </div>

            <div className="mt-6 flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
              <Shield className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-700 leading-relaxed">
                For your security, this code will expire in 1 minute. Never
                share this code with anyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
