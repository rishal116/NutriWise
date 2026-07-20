"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { NutritionistCardDTO } from "@/dtos/user/nutri-browsing/nutri-card.dto";
import { AvailabilityStatus } from "@/types/nutritionist.types";

interface NutritionistCardProps {
  item: NutritionistCardDTO;
}

const AVAILABILITY_LABEL: Record<AvailabilityStatus, string> = {
  available: "Available",
  busy: "Busy",
  offline: "Offline",
};

export default function NutritionistCard({ item }: NutritionistCardProps) {
  const router = useRouter();

  const goToProfile = () => router.push(`/coaching/${item.username}`);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToProfile}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToProfile();
        }
      }}
      className="cursor-pointer bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center transition-colors hover:border-emerald-200 hover:shadow-sm"
    >
      <div className="relative mb-4 w-28 h-28 sm:w-32 sm:h-32">
        <Image
          src={item.profileImage || "/images/images.jpg"}
          alt={item.fullName}
          fill
          className="object-contain"
        />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-center">
        {item.fullName}
      </h3>

      <p className="text-xs text-slate-500 mt-1 text-center">
        {item.coachLevel} · {item.totalExperienceYears} yrs experience
      </p>

      {item.specializations.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {item.specializations.slice(0, 2).map((specialization) => (
            <span
              key={specialization}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700"
            >
              {specialization}
            </span>
          ))}

          {item.specializations.length > 2 && (
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              +{item.specializations.length - 2}
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 text-slate-500 mt-3 text-sm">
        <span className="text-yellow-500 font-bold">
          {item.rating.toFixed(1)} ★
        </span>
        <span>|</span>
        <span>{item.totalReviews} reviews</span>
      </div>

      <span className="mt-3 text-xs font-medium text-slate-600">
        {AVAILABILITY_LABEL[item.availabilityStatus]}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/coaching/${item.username}`);
        }}
        className="w-full mt-6 sm:mt-8 bg-emerald-600 hover:bg-emerald-700 text-white py-3 sm:py-4 rounded-2xl font-medium transition-colors"
      >
        View
      </button>
    </div>
  );
}
