import { Briefcase } from "lucide-react";

import type { ExperienceDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";

import DetailsCard, { EmptyText } from "./DetailsCard";

export default function NutritionistExperienceSection({
  experiences,
}: {
  experiences: ExperienceDto[];
}) {
  return (
    <DetailsCard icon={Briefcase} title="Experience">
      {experiences.length ? (
        <ol className="space-y-6">
          {experiences.map((exp) => (
            <li
              key={`${exp.organization}-${exp.role}-${exp.durationYears}`}
              className="relative border-l border-slate-200 pl-6"
            >
              <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-emerald-500" />

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-slate-900">{exp.role}</p>
                <span className="w-fit rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                  {exp.durationYears} yrs
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-600">
                {exp.organization}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyText>No experience listed</EmptyText>
      )}
    </DetailsCard>
  );
}
