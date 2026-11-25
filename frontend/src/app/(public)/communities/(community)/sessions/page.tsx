
import type { Metadata } from "next";

import PublicSessionsClient from "@/components/public/sessions/list/PublicSessionsClient";

export const metadata: Metadata = {
  title: "Live Nutrition Sessions | NutriWise",
  description:
    "Discover live nutrition sessions led by nutritionists. Learn, connect, and improve your health with expert guidance.",
  openGraph: {
    title: "Live Nutrition Sessions | NutriWise",
    description:
      "Explore educational and interactive nutrition sessions with expert nutritionists.",
    type: "website",
  },
};

export default function PublicSessionsPage() {
  return <PublicSessionsClient />;
}
