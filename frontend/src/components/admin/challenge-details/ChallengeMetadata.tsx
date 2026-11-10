import type { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

type ChallengeStatus = AdminChallengeDetailsDTO["status"];

interface ChallengeMetadataProps {
  challenge: AdminChallengeDetailsDTO;
}

const STATUS_DESCRIPTIONS: Record<ChallengeStatus, string> = {
  draft:
    "This challenge is still being prepared and is not visible to participants.",
  published:
    "This challenge is currently published and available to participants.",
  archived: "This challenge has been archived and is no longer active.",
};

const STATUS_STYLES: Record<ChallengeStatus, string> = {
  published: "border-admin-success/30 bg-admin-pastel-green text-admin-success",
  draft: "border-admin-warning/30 bg-admin-warning/15 text-admin-warning",
  archived: "border-admin-border bg-admin-bg text-admin-muted",
};

export function ChallengeMetadata({ challenge }: ChallengeMetadataProps) {
  return (
    <aside>
      <section className="rounded-2xl border border-admin-border bg-admin-surface p-5 shadow-sm shadow-admin-text/5 sm:p-6">
        <h2 className="text-lg font-semibold text-admin-text">Status</h2>

        <div className="mt-5">
          <StatusBadge status={challenge.status} />

          <p className="mt-3 text-sm leading-6 text-admin-muted">
            {STATUS_DESCRIPTIONS[challenge.status]}
          </p>
        </div>
      </section>
    </aside>
  );
}

function StatusBadge({ status }: { status: ChallengeStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold capitalize ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}