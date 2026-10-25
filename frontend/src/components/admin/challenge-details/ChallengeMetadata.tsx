import type { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

interface ChallengeMetadataProps {
  challenge: AdminChallengeDetailsDTO;
}

export function ChallengeMetadata({ challenge }: ChallengeMetadataProps) {
  const statusDescriptions: Record<AdminChallengeDetailsDTO["status"], string> =
    {
      draft:
        "This challenge is still being prepared and is not visible to participants.",
      published:
        "This challenge is currently published and available to participants.",
      archived: "This challenge has been archived and is no longer active.",
    };

  return (
    <aside>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Status</h2>

        <div className="mt-5">
          <StatusBadge status={challenge.status} />

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {statusDescriptions[challenge.status]}
          </p>
        </div>
      </section>
    </aside>
  );
}

function StatusBadge({
  status,
}: {
  status: AdminChallengeDetailsDTO["status"];
}) {
  const styles: Record<AdminChallengeDetailsDTO["status"], string> = {
    published: "border-emerald-200 bg-emerald-50 text-emerald-700",
    draft: "border-amber-200 bg-amber-50 text-amber-700",
    archived: "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold capitalize ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
