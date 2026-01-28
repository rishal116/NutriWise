import React from "react";
import { DynamicInput, AddButton } from "../FormComponents";
import { Award } from "lucide-react";

interface Props {
  qualifications: string[];
  setQualifications: React.Dispatch<React.SetStateAction<string[]>>;
  errors: Record<string, string>;
}

export default function QualificationsSection({ qualifications, setQualifications, errors }: Props) {
  const addQualification = () => setQualifications(prev => [...prev, ""]);
  const removeQualification = (index: number) => setQualifications(prev => prev.filter((_, i) => i !== index));

  return (
    <div>
      <h3 className="text-xl font-semibold flex items-center gap-2"><Award /> Qualifications</h3>
      <div className="mt-3 space-y-3">
        {qualifications.map((q, i) => (
          <DynamicInput key={i} value={q} onChange={val => {
            const updated = [...qualifications]; updated[i] = val; setQualifications(updated);
          }} onRemove={() => removeQualification(i)} canRemove={qualifications.length > 1} placeholder="e.g., M.Sc. Nutrition" />
        ))}
      </div>
      <AddButton label="Add Another Qualification" onClick={addQualification} />
      {errors.qualifications && <p className="text-red-600 text-sm mt-1">{errors.qualifications}</p>}
    </div>
  );
}
