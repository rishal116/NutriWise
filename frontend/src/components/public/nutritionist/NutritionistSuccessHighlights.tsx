import { CheckCircle, TrendingUp } from "lucide-react";

interface NutritionistSuccessHighlightsProps {
  totalPeopleCoached: number;
  totalExperienceYears: number;
  rating: number;
}

export default function NutritionistSuccessHighlights({
  totalPeopleCoached,
  totalExperienceYears,
  rating,
}: NutritionistSuccessHighlightsProps) {
  const highlights = [
    `${totalPeopleCoached}+ clients transformed`,
    `${totalExperienceYears} years of expertise`,
    `${rating.toFixed(1)}/5 average rating`,
  ];

  return (
    <div className="rounded-2xl bg-emerald-700 p-5 text-white shadow-sm sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
        <TrendingUp size={16} />
        Success Highlights
      </h3>

      <div className="space-y-3">
        {highlights.map((highlight) => (
          <div
            key={highlight}
            className="flex items-start gap-2.5"
          >
            <CheckCircle
              size={14}
              className="mt-0.5 shrink-0 text-white/80"
            />

            <span className="text-sm font-medium leading-snug">
              {highlight}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}