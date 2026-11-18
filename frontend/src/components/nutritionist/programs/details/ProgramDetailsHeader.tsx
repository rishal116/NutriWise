
import type { ProgramStatus } from "@/constants/user/program/program-status.constants";

import { ProgramAvatar } from "@/components/nutritionist/programs/list/ProgramAvatar";
import { ProgramStatusBadge } from "@/components/nutritionist/programs/list/StatusBadges";

interface ProgramDetailsHeaderProps {
  client: {
    userId: string;
    fullName: string;
    profileImage?: string;
  };
  status: ProgramStatus;
  onMarkAsReady: () => void;
  markingReady: boolean;
}

export function ProgramDetailsHeader({
  client,
  status,
  onMarkAsReady,
  markingReady,
}: ProgramDetailsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <ProgramAvatar
          userProfileImage={client.profileImage}
          userFullName={client.fullName}
        />

        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-900">
            {client.fullName}
          </h1>

          <p className="text-sm text-slate-400">
            Client program details
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ProgramStatusBadge status={status} />

        {status === "preparing" && (
          <button
            type="button"
            onClick={onMarkAsReady}
            disabled={markingReady}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {markingReady ? "Marking as Ready..." : "Mark as Ready"}
          </button>
        )}
      </div>
    </div>
  );
}
