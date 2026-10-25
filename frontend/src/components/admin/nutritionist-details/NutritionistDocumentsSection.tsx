import { ExternalLink, FileText, Star } from "lucide-react";

import type { AdminNutritionistDetailsDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";

import DetailsCard, { EmptyText } from "./DetailsCard";
import { isHttpUrl } from "./nutritionist-details.utils";

export default function NutritionistDocumentsSection({
  details,
}: {
  details: AdminNutritionistDetailsDto;
}) {
  const { resumeUrl, certifications } = details;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <DetailsCard icon={FileText} title="Resume">
        {isHttpUrl(resumeUrl) ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            View resume
            <ExternalLink size={14} />
          </a>
        ) : (
          <EmptyText>No file attached</EmptyText>
        )}
      </DetailsCard>

      <DetailsCard icon={Star} title="Certifications">
        {certifications.length ? (
          <ul className="space-y-2">
            {certifications.map((cert) => {
              const content = (
                <>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-slate-700">
                      {cert.name}
                    </span>
                    <span className="block truncate text-[11px] text-slate-400">
                      {cert.issuedBy}
                    </span>
                  </span>
                  <ExternalLink size={14} className="shrink-0 text-slate-300" />
                </>
              );

              return (
                <li key={`${cert.name}-${cert.certificateUrl}`}>
                  {isHttpUrl(cert.certificateUrl) ? (
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyText>No certifications uploaded</EmptyText>
        )}
      </DetailsCard>
    </div>
  );
}