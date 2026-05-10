import OtpForm from "@/components/auth/VerifyOtp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification | NutriWise",
  description:
    "Verify your email address securely to complete your NutriWise account registration.",
};

export default function VerifyOtpPage() {
  return <OtpForm />;
}