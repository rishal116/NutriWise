"use client";
import { useEffect, useState } from "react";
import { nutritionistListService } from "@/services/user/nutritionistList.service";
import FilterBar from "@/components/ui/nutritionists/FilterBar";
import NutritionistCard from "@/components/ui/nutritionists/NutritionistCard";

export default function NutritionistsPage() {
  const [filters, setFilters] = useState({});
  const [nutritionists, setNutritionists] = useState([]);

  const fetchData = async () => {
    const response = await nutritionistListService.getAll(filters);
    setNutritionists(response.data);  // ✔ Set only array
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="min-h-screen bg-green-50 py-10 px-6">
      <div className="max-w-7xl mx-auto flex gap-6">

        <div className="w-72 shrink-0">
          <FilterBar onApply={(f: any) => setFilters(f)} />
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {nutritionists.length > 0 ? (
            nutritionists.map((n: any) => (
              <NutritionistCard key={n.id} item={n} /> 
            ))
          ) : (
            <p className="text-gray-600 text-lg">No nutritionists found</p>
          )}
        </div>
      </div>
    </div>
  );
}
