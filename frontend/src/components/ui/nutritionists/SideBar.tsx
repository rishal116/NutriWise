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
  Check,
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
  selected?: Specialization | Specialization[];
  onSelect: (value: Specialization | "") => void;
  onCloseMobile?: () => void;
}

export default function Sidebar({ selected, onSelect, onCloseMobile }: SidebarProps) {
  const isSelected = (value: Specialization): boolean => {
    if (!selected) return false;
    if (Array.isArray(selected)) return selected.includes(value);
    return selected === value;
  };

  const hasSelection = Array.isArray(selected) ? selected.length > 0 : !!selected;

  return (
    <aside className="w-full lg:w-72 h-full min-h-screen sticky top-0 bg-white border-r border-slate-200/80 shadow-sm flex flex-col font-sans">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Specializations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter coaches by domain
          </p>
        </div>
        {hasSelection && (
          <button
            type="button"
            onClick={() => onSelect("")}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors px-2.5 py-1 hover:bg-rose-50 rounded-lg"
          >
            Clear
          </button>
        )}
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden ml-2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200">
        {NUTRITIONIST_SPECIALIZATIONS.map((spec) => {
          const selectedState = isSelected(spec.value);
          const Icon = spec.icon;

          return (
            <button
              key={spec.value}
              type="button"
              title={spec.full}
              onClick={() => onSelect(selectedState ? "" : spec.value)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border ${
                selectedState
                  ? "bg-emerald-50/90 text-emerald-900 border-emerald-300/80 shadow-sm font-semibold"
                  : "bg-white text-slate-700 border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 ${
                  selectedState
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                }`}
              >
                <Icon size={16} />
              </div>

              <span className="flex-1 text-left truncate text-xs sm:text-sm">
                {spec.full}
              </span>

              {selectedState && (
                <Check size={16} className="text-emerald-600 shrink-0 stroke-[2.5]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-xs text-slate-500 text-center">
          {hasSelection ? (
            <span className="font-semibold text-emerald-700">
              Filtered by specialization
            </span>
          ) : (
            "Select a specialization to filter"
          )}
        </p>
      </div>
    </aside>
  );
}