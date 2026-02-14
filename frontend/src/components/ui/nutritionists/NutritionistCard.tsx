"use client";
import { useRouter } from "next/navigation";

interface NutritionistCardProps {
  item: {
    id: string;
    fullName: string;
    profileImage?: string;
    rating?: number;
    totalPeopleCoached?: number;
    defaultPlan?: string;
  };
}

export default function NutritionistCard({ item }: NutritionistCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/coaching/${item.id}`)}
      className="cursor-pointer bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center transition hover:shadow-xl hover:border-emerald-200 relative"
    >
      
      {/* Image */}
      <div className="relative mb-4">
        <img
          src={
            item.profileImage ||
            "https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
          }
          className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
          alt={item.fullName}
        />

        {item.defaultPlan && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
            {item.defaultPlan}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="text-lg sm:text-xl font-bold mt-4 text-gray-900 text-center">
        {item.fullName}
      </h3>

      {/* Meta Info */}
      <div className="flex items-center gap-2 text-gray-500 mt-2 text-sm">
        <span className="text-yellow-500 font-bold">
          {(item.rating ?? 4.5).toFixed(1)} ★
        </span>
        <span>|</span>
        <span>
          {item.totalPeopleCoached ?? 120} People Coached
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // VERY IMPORTANT
          router.push(`/coaching/${item.id}/plans`);
        }}
        className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 sm:py-4 rounded-2xl font-medium hover:from-emerald-600 hover:to-teal-700 transition"
      >
        See Plans
      </button>
    </div>
  );
}
