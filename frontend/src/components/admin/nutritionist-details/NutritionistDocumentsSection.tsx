import { ExternalLink, FileText, Star } from "lucide-react";

import type { AdminNutritionistDetailsDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";

import DetailsCard, { EmptyText } from "./DetailsCard";
import { isHttpUrl } from "./nutritionist-details.utils";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

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
            className={`inline-flex items-center gap-2 rounded-xl bg-admin-accent px-5 py-2.5 text-xs font-bold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover ${FOCUS_RING}`}
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
                    <span className="block truncate text-xs font-bold text-admin-text">
                      {cert.name}
                    </span>
                    <span className="block truncate text-[11px] text-admin-muted">
                      {cert.issuedBy}
                    </span>
                  </span>
                  <ExternalLink
                    size={14}
                    className="shrink-0 text-admin-muted"
                  />
                </>
              );

              return (
                <li key={`${cert.name}-${cert.certificateUrl}`}>
                  {isHttpUrl(cert.certificateUrl) ? (
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between gap-3 rounded-xl bg-admin-surface-hover p-3 transition-colors hover:bg-admin-bg ${FOCUS_RING}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-admin-surface-hover p-3">
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