import NutritionistTable from "@/components/admin/NutritionistTable";

export const metadata = {
  title: "Admin – Nutritionists",
  description: "Manage Nutritionists",
};

export default function NutritionistsPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-[90px] px-4">
      <NutritionistTable />
    </div>
  );
}
