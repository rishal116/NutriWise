import { ArrowUpRight, CalendarDays, Layers3 } from "lucide-react";
import type {
  ClientListItemDTO,
  ClientProgramSummaryDTO,
  ProgramStatus,
} from "@/dtos/nutritionist/client/client-response.dto";

import ClientAvatar from "./ClientAvatar";
import ClientProgramProgress from "./ClientProgramProgress";
import ClientStatusBadge from "./ClientStatusBadge";

interface ClientCardProps {
  client: ClientListItemDTO;
  onClick: (clientId: string) => void;
}

const PROGRAM_PRIORITY: ProgramStatus[] = [
  "active",
  "upcoming",
  "paused",
  "completed",
  "cancelled",
];

function getPrimaryProgram(
  programs: ClientProgramSummaryDTO[],
): ClientProgramSummaryDTO | null {
  for (const status of PROGRAM_PRIORITY) {
    const program = programs.find((item) => item.programStatus === status);

    if (program) {
      return program;
    }
  }

  return programs[0] ?? null;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ClientCard({
  client,
  onClick,
}: ClientCardProps) {
  const primaryProgram = getPrimaryProgram(client.programs ?? []);
  const additionalPrograms = Math.max(0, client.programs.length - 1);

  return (
    <button
      type="button"
      onClick={() => onClick(client.clientId)}
      aria-label={`View ${client.fullName}'s client details`}
      className="group flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    >
      <div className="flex w-full items-start gap-3">
        <ClientAvatar client={client} size="lg" />

        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="truncate text-sm font-bold text-slate-900">
            {client.fullName}
          </h2>
          <p className="mt-1 text-xs text-slate-500">Client</p>
        </div>

        <span className="rounded-lg border border-slate-200 p-2 text-slate-400 transition-colors group-hover:border-emerald-200 group-hover:text-emerald-700">
          <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </div>

      <div className="my-5 h-px w-full bg-slate-100" />

      {primaryProgram ? (
        <div className="flex w-full flex-1 flex-col">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Primary program
              </p>
              <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800">
                {primaryProgram.planTitle}
              </h3>
            </div>

            <ClientStatusBadge status={primaryProgram.programStatus} />
          </div>

          <ClientProgramProgress program={primaryProgram} />

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-1.5 text-slate-400">
                <CalendarDays size={13} aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  Started
                </span>
              </div>
              <p className="truncate text-xs font-semibold text-slate-700">
                {formatDate(primaryProgram.startDate)}
              </p>
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-1.5 text-slate-400">
                <CalendarDays size={13} aria-hidden="true" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">
                  Ends
                </span>
              </div>
              <p className="truncate text-xs font-semibold text-slate-700">
                {formatDate(primaryProgram.endDate)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Layers3 size={14} aria-hidden="true" />
              {client.programs.length}{" "}
              {client.programs.length === 1 ? "program" : "programs"}
            </span>

            {additionalPrograms > 0 && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                +{additionalPrograms} more
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-36 flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
          <Layers3
            size={24}
            className="mb-2 text-slate-400"
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-slate-700">
            No program assigned
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Open the client profile to view their details.
          </p>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-semibold text-slate-500">
          View client details
        </span>
        <span className="text-xs font-bold text-emerald-700 transition-colors group-hover:text-emerald-800">
          View profile
        </span>
      </div>
    </button>
  );
}