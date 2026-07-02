import type { Metadata } from "next";
import LandingPage from "@/components/public/landing/LandingPage";

export const metadata: Metadata = {
  title: "NutriWise | Personalized Nutrition & Wellness",
  description:
    "Connect with certified nutritionists, join health communities, and achieve your wellness goals.",
};

export default function Page() {
  return <LandingPage />;
}
