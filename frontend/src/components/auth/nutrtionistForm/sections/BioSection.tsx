import React from "react";
import { Section } from "../FormComponents";
import { FileText } from "lucide-react";

interface Props {
  bio: string;
  setBio: React.Dispatch<React.SetStateAction<string>>;
  errors: Record<string, string>;
}

export default function BioSection({ bio, setBio, errors }: Props) {
  return (
    <Section title="Bio / About You" icon={FileText} error={errors.bio}>
      <textarea
        value={bio}
        onChange={e => setBio(e.target.value)}
        placeholder="Describe yourself — your philosophy, goals, and what makes you unique..."
        className="w-full min-h-[140px] border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500"
      />
    </Section>
  );
}
