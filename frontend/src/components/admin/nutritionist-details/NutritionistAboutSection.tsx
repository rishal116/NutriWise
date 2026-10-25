import { Award } from "lucide-react";

import type { AdminNutritionistDetailsDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";

import DetailsCard, { EmptyText } from "./DetailsCard";
import { formatLabel } from "./nutritionist-details.utils";

function SubHeading({ children }: { children: string }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </h3>
  );
}

export default function NutritionistAboutSection({
  details,
}: {
  details: AdminNutritionistDetailsDto;
}) {
  const { bio, specializations, qualifications } = details;

  return (
    <DetailsCard icon={Award} title="About">
      <p className="whitespace-pre-line break-words text-sm leading-relaxed text-slate-600">
        {bio || "No biography provided."}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 md:grid-cols-2">
        <div>
          <SubHeading>Specializations</SubHeading>
          {specializations.length ? (
            <ul className="flex flex-wrap gap-2">
              {specializations.map((item) => (
                <li
                  key={item}
                  className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"
                >
                  {formatLabel(item)}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyText>None listed</EmptyText>
          )}
        </div>

        <div>
          <SubHeading>Qualifications</SubHeading>
          {qualifications.length ? (
            <ul className="space-y-3">
              {qualifications.map((q) => (
                <li key={`${q.degree}-${q.institution}-${q.year}`}>
                  <p className="text-sm font-semibold text-slate-800">
                    {q.degree}
                  </p>
                  <p className="text-xs text-slate-500">
                    {q.institution} · {q.year}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyText>None listed</EmptyText>
          )}
        </div>
      </div>
    </DetailsCard>
  );
}