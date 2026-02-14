import React from "react";
import { Section, SelectField, AddButton } from "../FormComponents";
import { Globe } from "lucide-react";
import { LANGUAGE_OPTIONS } from "@/constants/nutritionistDetails.constants";
import { X } from "lucide-react";

interface Props {
  languages: { name: string }[];
  setLanguages: React.Dispatch<React.SetStateAction<{ name: string }[]>>;
  languageInput: string;
  setLanguageInput: React.Dispatch<React.SetStateAction<string>>;
  errors: Record<string, string>;
}

export default function LanguagesSection({ languages, setLanguages, languageInput, setLanguageInput, errors }: Props) {
  const addLanguage = () => {
    if (!languageInput.trim() || languages.some(l => l.name === languageInput)) return;
    setLanguages([...languages, { name: languageInput }]);
    setLanguageInput("");
  };
  const removeLanguage = (i: number) => setLanguages(languages.filter((_, idx) => idx !== i));

  return (
    <Section title="Languages" icon={Globe} error={errors.languages}>
      <div className="flex gap-3">
        <SelectField options={LANGUAGE_OPTIONS} value={languageInput} onChange={e => setLanguageInput(e.target.value)} />
        <AddButton label="Add" onClick={addLanguage} />
      </div>
      <div className="flex gap-2 flex-wrap mt-4">
        {languages.map((lang, i) => (
          <span key={i} className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-2">
            {lang.name} <X className="cursor-pointer" size={16} onClick={() => removeLanguage(i)} />
          </span>
        ))}
      </div>
    </Section>
  );
}
