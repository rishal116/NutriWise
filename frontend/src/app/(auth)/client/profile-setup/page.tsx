import type { Metadata } from "next";
import ClientProfileSetupForm from "@/components/client/ClientProfileSetupForm";

export const metadata: Metadata = {
  title: "Complete Your Profile | NutriWise",
  description:
    "Set up your NutriWise client profile to unlock personalized nutrition plans and wellness recommendations.",
};

export default function ClientProfileSetupPage() {
  return <ClientProfileSetupForm />;
}