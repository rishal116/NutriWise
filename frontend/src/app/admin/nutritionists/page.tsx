import NutritionistTable from "@/components/admin/NutritionistTable";
import { adminUserService } from "@/services/admin/Adminuser.service";

export default async function NutritionistsPage() {
  const response = await adminUserService.getAllNutritionists(1, 5);

  return (
    <div className="ml-72 mt-24 p-8 min-h-screen bg-gray-50">
      <NutritionistTable initialData={response} />
    </div>
  );
}
