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
              className="relative border-l border-admin-border pl-6"
            >
              <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-admin-accent ring-4 ring-admin-surface" />

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-admin-text">{exp.role}</p>
                <span className="w-fit rounded-lg bg-admin-surface-hover px-2.5 py-1 text-xs font-bold text-admin-muted">
                  {exp.durationYears} yrs
                </span>
              </div>
              <p className="text-sm font-semibold text-admin-accent">
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