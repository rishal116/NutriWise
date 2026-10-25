import type { Metadata } from "next";

import CompleteProfileForm from "@/components/auth/complete-profile/CompleteProfileForm";

export const metadata: Metadata = {
  title: "Complete Your Profile | NutriWise",
  description:
    "Complete your health profile to personalise your NutriWise experience.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompleteProfilePage() {
  return <CompleteProfileForm />;
}
