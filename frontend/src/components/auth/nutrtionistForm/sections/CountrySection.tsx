import React from "react";
import { Section, SelectField } from "../FormComponents";
import { Globe } from "lucide-react";
import { COUNTRIES } from "@/constants/nutritionist/nutritionistDetails.constants";

interface Props {
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  errors: Record<string, string>;
}

export default function CountrySection({ country, setCountry, errors }: Props) {
  return (
    <Section title="Country" icon={Globe} error={errors.country}>
      <SelectField options={COUNTRIES} value={country} onChange={e => setCountry(e.target.value)} />
    </Section>
  );
}
