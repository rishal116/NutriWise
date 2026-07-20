import {
  Scale,
  Dumbbell,
  Stethoscope,
  Activity,
  HeartPulse,
  Heart,
  ShieldCheck,
  Sprout,
  Baby,
  Flower2,
  Users,
  Leaf,
  Flame,
  Sun,
  X,
} from "lucide-react";
import { Specialization } from "@/types/nutritionist.types";

interface SpecializationOption {
  value: Specialization;
  full: string;
  short: string;
  icon: typeof Scale;
}

export const NUTRITIONIST_SPECIALIZATIONS: SpecializationOption[] = [
  { value: "weight_loss", full: "Weight Loss", short: "Weight Loss", icon: Scale },
  { value: "weight_gain", full: "Weight Gain", short: "Weight Gain", icon: Dumbbell },
  { value: "sports_nutrition", full: "Sports Nutrition", short: "Sports", icon: Activity },
  { value: "clinical_nutrition", full: "Clinical Nutrition", short: "Clinical", icon: Stethoscope },
  { value: "diabetes_management", full: "Diabetes Management", short: "Diabetes", icon: HeartPulse },
  { value: "pcos_nutrition", full: "PCOS Nutrition", short: "PCOS", icon: Flower2 },
  { value: "renal_nutrition", full: "Renal Nutrition", short: "Renal", icon: ShieldCheck },
  { value: "cardiac_nutrition", full: "Cardiac Nutrition", short: "Cardiac", icon: Heart },
  { value: "gut_health", full: "Gut Health", short: "Gut Health", icon: Sprout },
  { value: "child_nutrition", full: "Child Nutrition", short: "Child", icon: Baby },
  { value: "pregnancy_nutrition", full: "Pregnancy Nutrition", short: "Pregnancy", icon: Flower2 },
  { value: "elderly_nutrition", full: "Elderly Nutrition", short: "Elderly", icon: Users },
  { value: "vegan_nutrition", full: "Vegan Nutrition", short: "Vegan", icon: Leaf },
  { value: "ketogenic_diet", full: "Ketogenic Diet", short: "Keto", icon: Flame },
  { value: "general_wellness", full: "General Wellness", short: "Wellness", icon: Sun },
];

interface SidebarProps {
  selected: Specialization[];
  onSelect: (value: Specialization | "") => void;
}

export default function Sidebar({ selected = [], onSelect }: SidebarProps) {
  return (
    <aside className="w-full lg:w-72 h-screen sticky top-0 bg-white border-r border-slate-200 shadow-sm flex flex-col">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Specializations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Filter by expertise area
          </p>
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => onSelect("")}
            className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600 transition-colors px-2 py-1 hover:bg-red-50 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {NUTRITIONIST_SPECIALIZATIONS.map((spec) => {
          const isSelected = selected.includes(spec.value);
          const Icon = spec.icon;

          return (
            <button
              key={spec.value}
              type="button"
              title={spec.full}
              onClick={() => onSelect(spec.value)}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-medium transition-colors border ${
                isSelected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-white text-slate-600 border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
              </div>

              <span className="flex-1 text-left truncate text-xs sm:text-sm">
                {spec.short}
              </span>

              {isSelected && (
                <X size={16} className="text-emerald-700 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 bg-emerald-50/50">
        <p className="text-xs text-slate-600 text-center">
          {selected.length > 0 ? (
            <span className="font-semibold text-emerald-700">
              {selected.length} filter active
            </span>
          ) : (
            "Select a specialization to filter"
          )}
        </p>
      </div>
    </aside>
  );
}