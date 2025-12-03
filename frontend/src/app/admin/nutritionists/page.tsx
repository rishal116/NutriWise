import NutritionistTable from "@/components/admin/NutritionistTable";
import { adminUserService } from "@/services/admin/adminUser.service";

export default async function NutritionistsPage() {
  const response = await adminUserService.getAllNutritionists(1, 5);

  return (
  <div className="min-h-screen bg-gray-50 mt-[90px] px-4">
      <NutritionistTable initialData={response} />
    </div>
  );
}
