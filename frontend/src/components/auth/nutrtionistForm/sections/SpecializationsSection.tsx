import React from "react";
import { Section } from "../FormComponents";
import { Briefcase } from "lucide-react";
import { NUTRITIONIST_SPECIALIZATIONS } from "@/constants/nutritionistDetails.constants";

interface Props {
  specializations: string[];
  setSpecializations: React.Dispatch<React.SetStateAction<string[]>>;
  errors: Record<string, string>;
}

export default function SpecializationsSection({ specializations, setSpecializations, errors }: Props) {
  return (
    <Section title="Specializations" icon={Briefcase} error={errors.specializations}>
      <div className="flex flex-wrap gap-2">
        {NUTRITIONIST_SPECIALIZATIONS.map(spec => {
          const isSelected = specializations.includes(spec);
          return (
            <button
              key={spec}
              type="button"
              className={`px-4 py-2 rounded-xl border text-sm transition 
                ${isSelected ? "bg-emerald-600 text-white border-emerald-600" : "bg-gray-100 border-gray-300 hover:bg-emerald-50"}`}
              onClick={() => setSpecializations(prev => 
                prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
              )}
            >
              {spec}
            </button>
          );
        })}
      </div>
    </Section>
  );
}
