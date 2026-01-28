import NutritionistDashboard from "@/components/nutritionist/NutritionistDashboard";
import { useNutritionistGuard } from "@/hooks/nutritionist/useNutritionistGuard";

export const metadata = {
  title: "NutriWise - Nutritionist Dashboard",
};

export default function DashboardPage() {
   useNutritionistGuard();
  return <NutritionistDashboard />;
}
