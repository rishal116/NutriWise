import Link from "next/link";
import {
  Award,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

import { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";

interface NutritionistProfessionalDetailsProps {
  profile: NutritionistDetailDTO["profile"];
}

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function NutritionistProfessionalDetails({
  profile,
}: NutritionistProfessionalDetailsProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-6 flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900">
        <span className="h-5 w-1 rounded-full bg-emerald-600" />
        Professional Details
      </h3>

      <div className="space-y-6">
        {profile.experiences.length > 0 && (
          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Briefcase
                size={12}
                className="shrink-0 text-emerald-600"
              />
              Experience
            </p>

            <div className="space-y-2">
              {profile.experiences.map((experience) => (
                <div
                  key={`${experience.role}-${experience.organization}-${experience.durationYears}`}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  <p className="text-sm font-semibold leading-snug text-slate-900">
                    {experience.role}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {experience.organization} ·{" "}
                    {experience.durationYears}{" "}
                    {experience.durationYears === 1
                      ? "yr"
                      : "yrs"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.qualifications.length > 0 && (
          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Award
                size={12}
                className="shrink-0 text-emerald-600"
              />
              Qualifications
            </p>

            <div className="space-y-2">
              {profile.qualifications.map((qualification) => (
                <div
                  key={`${qualification.degree}-${qualification.institution}-${qualification.year}`}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  <p className="text-sm font-semibold leading-snug text-slate-900">
                    {qualification.degree}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {qualification.institution} ·{" "}
                    {qualification.year}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.certifications.length > 0 && (
          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <ShieldCheck
                size={12}
                className="shrink-0 text-sky-600"
              />
              Certifications
            </p>

            <div className="space-y-2">
              {profile.certifications.map((certification) => (
                <div
                  key={`${certification.name}-${certification.issuedBy}`}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  <p className="text-sm font-semibold leading-snug text-slate-900">
                    {certification.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Issued by {certification.issuedBy}
                  </p>

                  {certification.certificateUrl && (
                    <Link
                      href={certification.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      View certificate →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.specializations.length > 0 && (
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Specializations
            </p>

            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((specialization) => (
                <span
                  key={specialization}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                >
                  {formatLabel(specialization)}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.languages.length > 0 && (
          <div>
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Languages
            </p>

            <div className="flex flex-wrap gap-2">
              {profile.languages.map((language) => (
                <span
                  key={language}
                  className="rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {formatLabel(language)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}