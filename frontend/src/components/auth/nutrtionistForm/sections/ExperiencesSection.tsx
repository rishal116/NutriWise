import React from "react";
import { Section, InputField, AddButton } from "../FormComponents";
import { Briefcase } from "lucide-react";

interface Experience { role: string; organization: string; years: string; }
interface Props {
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  errors: Record<string, string>;
}

export default function ExperiencesSection({ experiences, setExperiences, errors }: Props) {
  const addExperience = () => setExperiences(prev => [...prev, { role: "", organization: "", years: "" }]);
  const updateExperience = (i: number, field: keyof Experience, val: string) =>
    setExperiences(prev => prev.map((exp, idx) => idx === i ? { ...exp, [field]: val } : exp));
  const removeExperience = (i: number) => setExperiences(prev => prev.filter((_, idx) => idx !== i));

  return (
    <Section title="Work Experience" icon={Briefcase} error={errors.experiences}>
      {experiences.map((exp, i) => (
        <div key={i} className="grid md:grid-cols-3 gap-4 mb-3">
          <InputField placeholder="Role/Position" value={exp.role} onChange={v => updateExperience(i, "role", v)} />
          <InputField placeholder="Organization/Hospital" value={exp.organization} onChange={v => updateExperience(i, "organization", v)} />
          <InputField placeholder="Years" type="number" value={exp.years} onChange={v => updateExperience(i, "years", v)} />
          {experiences.length > 1 && (
            <button type="button" className="text-red-600 font-medium" onClick={() => removeExperience(i)}>Remove</button>
          )}
        </div>
      ))}
      <AddButton label="Add Work Experience" onClick={addExperience} />
    </Section>
  );
}
