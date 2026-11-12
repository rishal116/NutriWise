import type { Metadata } from "next";

import CreatePlanClient from "@/components/nutritionist/plans/create/CreatePlanClient";

export const metadata: Metadata = {
  title: "Create Nutrition Plan | NutriWise",
  description: "Create and publish your personalized nutrition plans.",
};

export default function CreatePlanPage() {
  return <CreatePlanClient />;
}
