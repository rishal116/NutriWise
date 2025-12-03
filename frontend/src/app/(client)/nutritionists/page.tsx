import { nutritionistListService } from "@/services/user/nutritionistList.service";
import FilterBar from "@/components/ui/nutritionists/FilterBar";
import NutritionistCard from "@/components/ui/nutritionists/NutritionistCard";

export const metadata = {
  title: "NutriWise - Nutritionists",
};

export default async function NutritionistsPage() {
  const response = await nutritionistListService.getAll();
  const nutritionists = response.data;
  console.log(nutritionists);
  

  return (
    <div className="min-h-screen bg-green-50 py-10 px-6">
      <div className="max-w-7xl mx-auto flex gap-6">

        {/* Left Filter */}
        <div className="w-72 shrink-0">
          <FilterBar />
        </div>

        {/* Right Cards */}
        <div className="flex flex-col gap-6 flex-1">
          {nutritionists?.map((n: any) => (
            <NutritionistCard key={n.id} item={n} />
          ))}
        </div>
      </div>
    </div>
  );
}
