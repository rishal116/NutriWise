"use client";

import { useEffect, useState } from "react";
import { nutritionistListService } from "@/services/user/nutritionistList.service";
import FilterBar from "@/components/ui/nutritionists/FilterBar";
import NutritionistCard from "@/components/ui/nutritionists/NutritionistCard";

export interface Filters {
  search?: string;
  specializations?: string[];
  languages?: string[];
  country?: string[];
  availabilityStatus?: string[];
  minExperience?: number;
  minRating?: number;
}

export default function NutritionistsPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [nutritionists, setNutritionists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await nutritionistListService.getAll(filters);
      setNutritionists(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  return (
    <div className="min-h-screen bg-green-50 py-10 px-6">
      <div className="max-w-7xl mx-auto flex gap-6">
        <div className="w-72 shrink-0">
          <FilterBar onApply={setFilters} />
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {loading && <p className="text-gray-600">Loading...</p>}

          {!loading && nutritionists.length > 0 ? (
            nutritionists.map((n) => (
              <NutritionistCard key={n._id} item={n} />
            ))
          ) : (
            !loading && (
              <p className="text-gray-600 text-lg">
                No nutritionists found
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
