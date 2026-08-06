import Image from "next/image";
import Link from "next/link";
import { Star, ShieldCheck, Award, Sparkles, User, ArrowRight } from "lucide-react";
import { NutritionistCardDTO } from "@/dtos/user/nutri-browsing/nutri-card.dto";
import { CoachLevel, Specialization } from "@/types/nutritionist.types";

interface NutritionistCardProps {
  item: NutritionistCardDTO;
}

const COACH_LEVEL_CONFIG: Record<
  CoachLevel,
  { label: string; bg: string; text: string; border: string; icon: typeof Award }
> = {
  beginner: {
    label: "Beginner",
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    icon: User,
  },
  verified: {
    label: "Verified",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    icon: ShieldCheck,
  },
  expert: {
    label: "Expert",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    icon: Award,
  },
  top_coach: {
    label: "Top Coach",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    icon: Sparkles,
  },
};

const FORMATTED_SPEC_LABELS: Record<Specialization, string> = {
  weight_loss: "Weight Loss",
  weight_gain: "Weight Gain",
  sports_nutrition: "Sports Nutrition",
  clinical_nutrition: "Clinical Care",
  diabetes_management: "Diabetes Care",
  pcos_nutrition: "PCOS Care",
  renal_nutrition: "Renal Care",
  cardiac_nutrition: "Cardiac Care",
  gut_health: "Gut Health",
  child_nutrition: "Pediatric Care",
  pregnancy_nutrition: "Maternal Health",
  elderly_nutrition: "Geriatric Care",
  vegan_nutrition: "Plant-Based",
  ketogenic_diet: "Keto Specialist",
  general_wellness: "General Wellness",
};

export default function NutritionistCard({ item }: NutritionistCardProps) {
  const visibleSpecs = (item.specializations || []).slice(0, 2);
  const hiddenCount = (item.specializations || []).length - visibleSpecs.length;
  const coachConfig = COACH_LEVEL_CONFIG[item.coachLevel] || COACH_LEVEL_CONFIG.beginner;
  const CoachIcon = coachConfig.icon;

  const formattedRating = Number(item.rating || 0).toFixed(1);
  const hasReviews = (item.totalReviews || 0) > 0;

  return (
    <Link
      href={`/coaching/${item.username}`}
      aria-label={`View ${item.fullName}'s profile`}
      className="group relative aspect-[1/1] w-full flex flex-col justify-between items-center rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-emerald-300 hover:shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 text-center overflow-hidden"
    >
      {/* Top Centered Circular Avatar */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-emerald-500/10 group-hover:ring-emerald-500/30 transition-all bg-slate-100 shadow-xs mb-2">
        {item.profileImage ? (
          <Image
            src={item.profileImage}
            alt={item.fullName}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-700 text-white font-bold text-xl">
            {item.fullName ? item.fullName.charAt(0).toUpperCase() : "N"}
          </div>
        )}
      </div>

      {/* Center Details */}
      <div className="flex flex-col items-center gap-1 w-full my-auto">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-tight px-1">
          {item.fullName}
        </h3>

        {/* Coach Level Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${coachConfig.bg} ${coachConfig.text} ${coachConfig.border}`}
        >
          <CoachIcon size={11} />
          {coachConfig.label}
        </span>

        {/* Rating & Reviews + Experience Line */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-0.5">
          {hasReviews ? (
            <div className="flex items-center gap-1 font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px]">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span>{formattedRating}</span>
              <span className="text-[10px] text-amber-700 font-normal">
                ({item.totalReviews})
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">New Coach</span>
          )}
          <span className="text-slate-300">•</span>
          <span className="text-[11px] font-medium text-slate-600">
            {item.totalExperienceYears || 0}{" "}
            {item.totalExperienceYears === 1 ? "yr" : "yrs"} exp
          </span>
        </div>

        {/* Specialization Tags */}
        {visibleSpecs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            {visibleSpecs.map((spec) => (
              <span
                key={spec}
                className="inline-block bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-100"
              >
                {FORMATTED_SPEC_LABELS[spec] || spec}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded">
                +{hiddenCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full pt-2 border-t border-slate-100 mt-auto">
        <div className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 text-slate-700 font-semibold text-xs transition-all duration-200 group-hover:bg-emerald-700 group-hover:text-white">
          <span>View Profile</span>
          <ArrowRight
            size={13}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
