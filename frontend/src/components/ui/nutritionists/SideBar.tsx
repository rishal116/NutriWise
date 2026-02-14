import {
  Apple,
  Dumbbell,
  Flower2,
  Music,
  Timer,
  HeartPulse,
  Sun,
  Star,
  ShieldCheck,
  Heart,
  BookOpen,
  X,
} from "lucide-react";

export const NUTRITIONIST_SPECIALIZATIONS = [
  { full: "Clinical Nutrition", short: "Clinical", icon: Apple },
  { full: "Sports Nutrition", short: "Sports", icon: Dumbbell },
  { full: "Pediatric Nutrition", short: "Pediatric", icon: Flower2 },
  { full: "Geriatric Nutrition", short: "Geriatric", icon: Music },
  { full: "Weight Management", short: "Weight Mgmt", icon: Timer },
  { full: "Diabetes & Metabolic Disorders", short: "Diabetes", icon: HeartPulse },
  { full: "Cardiac Nutrition", short: "Cardiac", icon: Heart },
  { full: "Renal Nutrition", short: "Renal", icon: ShieldCheck },
  { full: "Digestive / Gut Health", short: "Digestive", icon: Sun },
  { full: "Food Allergies & Intolerances", short: "Allergies", icon: Star },
  { full: "Plant-Based / Vegan Nutrition", short: "Plant-Based", icon: Apple },
  { full: "Nutrition Counseling & Lifestyle Coaching", short: "Counseling", icon: BookOpen },
  { full: "Prenatal & Maternal Nutrition", short: "Prenatal", icon: Flower2 },
  { full: "Immunity & Wellness", short: "Immunity", icon: Dumbbell },
];

export default function Sidebar({ selected = [], onSelect }: any) {
  return (
    <aside className="w-full lg:w-72 h-screen sticky top-0 bg-white border-r border-slate-200 shadow-sm flex flex-col">

      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Specializations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Filter by expertise area
          </p>
        </div>
        {selected.length > 0 && (
          <button 
            onClick={() => onSelect("")}
            className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-600 transition px-2 py-1 hover:bg-red-50 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {NUTRITIONIST_SPECIALIZATIONS.map((spec) => {
          const isSelected = selected.includes(spec.full);
          const Icon = spec.icon;

          return (
            <button
              key={spec.full}
              type="button"
              title={spec.full}
              onClick={() => onSelect(spec.full)}
              className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm font-medium transition-all duration-200 border
                ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-300 shadow-sm"
                    : "bg-white text-slate-600 border-transparent hover:border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition-all ${
                  isSelected 
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md" 
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {Icon && <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />}
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

      {/* Footer hint (optional) */}
      <div className="p-4 border-t border-slate-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/50">
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