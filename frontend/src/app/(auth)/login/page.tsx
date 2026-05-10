import type { Metadata } from "next";
import LoginForm from "@/components/auth/Login";

export const metadata: Metadata = {
  title: "Login | NutriWise",
  description:
    "Login to NutriWise to access your personalized nutrition and wellness dashboard.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginForm />;
}