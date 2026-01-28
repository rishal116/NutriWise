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
    <aside className="w-72 h-screen sticky top-0 bg-white border-r border-slate-200 shadow-sm flex flex-col">

      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Specializations
          </h2>
            <p className="text-xs text-slate-500 mt-1">
              Filter by expertise area
            </p>
        </div>
              {selected.length > 0 && (
                <button onClick={() => onSelect("")}
                className="text-xs font-semibold text-red-500 hover:text-red-600 transition">
                  Clear
                </button>
                )}
      </div>


      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {NUTRITIONIST_SPECIALIZATIONS.map((spec) => {
          const isSelected = selected.includes(spec.full);
          const Icon = spec.icon;

          return (
            <button
              key={spec.full}
              type="button"
              title={spec.full}
              onClick={() => onSelect(spec.full)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 border
                ${
                  isSelected
                    ? "bg-green-50 text-green-700 border-green-300 shadow-sm"
                    : "bg-white text-slate-600 border-transparent hover:border-slate-200 hover:bg-slate-50"
                }
              `}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-xl ${
                  isSelected ? "bg-green-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {Icon && <Icon size={16} />}
              </div>

              <span className="flex-1 text-left truncate">{spec.short}</span>

              {isSelected && (
                <X size={16} className="text-green-700 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
