"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearAuth } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/user.service";

export default function OtpForm() {
  const { email } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no user email
  useEffect(() => {
    if (!email) {
      router.replace("/signup");
    }
  }, [email, router]);

  // Focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer
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
    if (!email) {
      alert("Email not found. Please sign up again.");
      router.replace("/signup");
      return;
    }

    try {
      const otpString = otp.join("");
      const res = await userAuthService.verifyOtp(email, otpString);
      alert(res.message);
      router.replace("/select-role");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Invalid OTP.");
    }
  };

  const handleResend = async () => {
    if (!email) {
      alert("Email not found. Please sign up again.");
      router.replace("/signup");
      return;
    }
    
    try {
      const res = await userAuthService.resendOtp(email);
      alert(res.message);
      setTimer(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to resend OTP.");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-700">OTP Verification</h1>
        <p className="mb-6 text-gray-600">
          Enter the 6-digit OTP sent to your email {email && `(${email})`}
        </p>

        <div className="flex justify-between mb-4">
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
              className="w-12 h-14 text-center text-lg border rounded-md border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={otp.some(d => d === "")}
          className={`w-full py-2 rounded-md font-semibold mb-2 text-white transition ${
            otp.some(d => d === "")
              ? "bg-green-200 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          Verify
        </button>

        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500">
            {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "OTP expired"}
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
  );
}
