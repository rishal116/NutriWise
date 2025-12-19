"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NutritionistCard({ item }: any) {
  console.log(item);
  
  const router = useRouter();

  const rating = item.rating ?? "4.5";
  const experience = item.totalExperienceYears ?? "5";

  const doctorImages = [
    "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    "https://cdn-icons-png.flaticon.com/512/3870/3870822.png",
    "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",
  ];

  const image =
    item.image ||
    doctorImages[Math.floor(Math.random() * doctorImages.length)];

  return (
    <div className="group bg-white rounded-2xl border hover:shadow-xl transition flex h-40">
      <div className="p-5 flex flex-col justify-between flex-1">
        <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full">
          {item.availabilityStatus ?? "Available"}
        </span>

        <h3 className="text-lg font-semibold">
          Dr. {item.fullName}
        </h3>

        <p className="text-sm text-gray-600">
          {item.specializations?.join(", ")} · {rating} ⭐ · {experience} yrs
        </p>

        <button
          onClick={() => router.push(`/nutritionists/${item.id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm"
        >
          View Profile <ArrowRight size={16} />
        </button>
      </div>

      <div className="w-44 flex items-center justify-center">
        <img
          src={image}
          alt={item.fullName}
          className="w-28 h-28 rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
