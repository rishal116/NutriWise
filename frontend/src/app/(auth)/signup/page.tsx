import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Signup | NutriWise",
  description:
    "Create your NutriWise account and start your personalized nutrition, fitness, and wellness journey.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupPage() {
  return <SignupForm />;
}