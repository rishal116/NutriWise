"use client"

import { useNutritionistGuard } from "@/hooks/nutritionist/useNutritionistGuard";
export default function NutritionistDashboard() {
     useNutritionistGuard();
  return (
    <h1 className="text-3xl font-bold">
      Nutritionist Dashboard
    </h1>
  );
}
