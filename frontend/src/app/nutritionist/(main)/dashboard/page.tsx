import type { Metadata } from "next";

import NutritionistDashboard from "@/components/nutritionist/dashboard/NutritionistDashboard";

export const metadata: Metadata = {
  title: "Nutritionist Dashboard | NutriWise",
  description:
    "Manage your nutrition coaching activities, clients, programs, plans, and earnings from your NutriWise nutritionist dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NutritionistDashboardPage() {
  return <NutritionistDashboard />;
}
