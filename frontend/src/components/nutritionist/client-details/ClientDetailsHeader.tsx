import Image from "next/image";
import { ArrowLeft, CalendarDays, Layers3 } from "lucide-react";
import type { ClientDetailsResponseDTO } from "@/dtos/nutritionist/client/client-response.dto";

interface ClientDetailsHeaderProps {
  client: ClientDetailsResponseDTO;
  onBack: () => void;
}

function getInitials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?";
}

export default function ClientDetailsHeader({
  client,
  onBack,
}: ClientDetailsHeaderProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-24 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 sm:h-32" />

      <div className="px-5 pb-5 sm:px-7 sm:pb-7">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            {client.profileImage ? (
              <Image
                src={client.profileImage}
                alt={`${client.fullName}'s profile`}
                width={88}
                height={88}
                className="h-20 w-20 rounded-2xl border-4 border-white bg-white object-cover shadow-sm sm:h-24 sm:w-24"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-2xl font-bold text-emerald-800 shadow-sm sm:h-24 sm:w-24">
                {getInitials(client.fullName)}
              </div>
            )}

            <div className="min-w-0 pb-0.5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Client profile
              </p>
              <h1 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {client.fullName}
              </h1>
              <p className="mt-1 break-all text-sm text-slate-500">
                {client.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 sm:self-auto">
            <Layers3 size={16} className="text-emerald-700" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">
              {client.programs.length}{" "}
              {client.programs.length === 1 ? "program" : "programs"}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={15} aria-hidden="true" />
            <span>
              Client ID:{" "}
              <span className="font-medium text-slate-700">
                {client.clientId}
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to clients
          </button>
        </div>
      </div>
    </section>
  );
}