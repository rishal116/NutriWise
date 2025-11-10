"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { userAuthService } from "@/services/user/user.service";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionist.service";
import toast, { Toaster } from "react-hot-toast";

interface OtpFormProps {
  roles: "client" | "nutritionist";
}

export default function OtpForm({ roles }: OtpFormProps) {
  const { email, role } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no email or role
  useEffect(() => {
    if (!email || !role) {
      router.replace(`/${role}/signup`);
    }
  }, [email, role, router]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer countdown
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

  const handleVerify = async () => {
    if (!email || !role) {
      toast.error("Invalid session. Please sign up again.");
      router.replace(`/${role}/signup`);
      return;
    }

    try {
      const otpString = otp.join("");
      const service = role === "nutritionist" ? nutritionistAuthService : userAuthService;
      const res = await service.verifyOtp(email, otpString);

     if (res.success) {
  toast.success(res.message || "OTP verified successfully!");

  // ⬇️ Store access token
  if (res.accessToken) {
    localStorage.setItem("token", res.accessToken);
  }

  setTimeout(() => {
    if (role === "nutritionist") router.replace("/nutritionist/details");
    else router.replace("/home");
  }, 1000);
} else {
  toast.error(res.message || "Verification failed. Please try again.");
}
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP or OTP expired.");
    }
  };

  const handleResend = async () => {
    if (!email || !role) {
      toast.error("Invalid session. Please sign up again.");
      router.replace(`/${role}/signup`);
      return;
    }

    try {
      const service = role === "nutritionist" ? nutritionistAuthService : userAuthService;
      const res = await service.resendOtp(email);

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

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3 text-green-700">OTP Verification</h1>
          <p className="mb-6 text-gray-600">
            Enter the 6-digit OTP sent to your email <br />
            <span className="font-medium text-green-600">{email}</span>
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-between mb-6">
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
                className="w-12 h-14 text-center text-lg font-semibold border-2 rounded-lg border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.some(d => d === "") || timer <= 0}
            className={`w-full py-2 rounded-md font-semibold mb-3 text-white transition ${
              otp.some(d => d === "") || timer <= 0
                ? "bg-green-200 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Verify
          </button>

          {/* Timer and Resend */}
          <div className="mt-4 flex flex-col items-center">
            <div className="relative w-48 h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div
                className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-1000"
                style={{ width: `${(timer / 60) * 100}%` }}
              ></div>
            </div>

            <span className="text-gray-500 text-sm mb-2">
              {timer > 0 ? `OTP expires in ${formatTime(timer)}` : "OTP expired"}
            </span>

            <button
              disabled={!canResend}
              onClick={handleResend}
              className={`text-green-700 font-semibold ${
                canResend ? "hover:underline" : "opacity-50 cursor-not-allowed"
              }`}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
