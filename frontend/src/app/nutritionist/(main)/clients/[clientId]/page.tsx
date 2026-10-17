"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { nutriClientService } from "@/services/nutritionist/nutriClient.service";
import type {
  ClientDetailsResponseDTO,
  ClientProgramSummaryDTO,
  ProgramStatus,
  SubscriptionStatus,
} from "@/dtos/nutritionist/client/client-response.dto";

const PROGRAM_STYLES: Record<ProgramStatus, string> = {
  upcoming: "bg-sky-50 text-sky-700 border-sky-100",
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  paused: "bg-amber-50 text-amber-700 border-amber-100",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

const SUBSCRIPTION_STYLES: Record<SubscriptionStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  expired: "bg-rose-50 text-rose-700 border-rose-100",
  cancelled: "bg-slate-100 text-slate-500 border-slate-200",
};

function formatDate(value?: Date | string): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
      <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}

function ProgramCard({ program }: { program: ClientProgramSummaryDTO }) {
  const pct = Math.min(100, Math.max(0, program.completionPercentage));

  return (
    <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-900">
          {program.planTitle}
        </h3>
        <div className="flex gap-1.5">
          <Badge
            label={program.subscriptionStatus}
            className={SUBSCRIPTION_STYLES[program.subscriptionStatus]}
          />
          <Badge
            label={program.programStatus}
            className={PROGRAM_STYLES[program.programStatus]}
          />
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
          <span>
            Day {program.currentDay}/{program.durationDays}
          </span>
          <span>{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <InfoRow label="Start date" value={formatDate(program.startDate)} />
        <InfoRow label="End date" value={formatDate(program.endDate)} />
      </div>
    </div>
  );
}

export default function ClientDetailsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const router = useRouter();

  const [client, setClient] = useState<ClientDetailsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await nutriClientService.getClientDetails(clientId);
        if (!cancelled) setClient(res);
      } catch {
        if (!cancelled) {
          setNotFound(true);
          toast.error("Couldn't load this client's details.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clientId]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to clients
        </button>

        {loading ? (
          <DetailSkeleton />
        ) : notFound || !client ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
            <p className="text-sm font-bold text-slate-700">
              Client not found
            </p>
            <p className="text-xs text-slate-400">
              This client may have been removed or the link is incorrect.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {client.profileImage ? (
                  <Image
                    src={client.profileImage}
                    alt={client.fullName}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-xl font-bold text-white">
                    {client.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-bold text-slate-900">
                    {client.fullName}
                  </h1>
                  <p className="text-sm text-slate-400">@{client.username}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {client.programs.length}{" "}
                {client.programs.length === 1 ? "program" : "programs"}
              </span>
            </div>

            {/* Contact */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Contact</h2>
              <div className="space-y-2.5">
                <InfoRow label="Email" value={client.email} />
                <InfoRow label="Phone" value={client.phone ?? "—"} />
                <InfoRow label="Gender" value={client.gender ?? "—"} />
                <InfoRow
                  label="Birth date"
                  value={formatDate(client.birthDate)}
                />
              </div>
            </div>

            {/* Health */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">
                Health details
              </h2>
              <div className="space-y-2.5">
                <InfoRow
                  label="Height"
                  value={`${client.health.heightCm} cm`}
                />
                <InfoRow
                  label="Weight"
                  value={`${client.health.weightKg} kg`}
                />
                <InfoRow
                  label="Activity level"
                  value={client.health.activityLevel}
                />
                <InfoRow label="Diet type" value={client.health.dietType} />
                <InfoRow label="Goal" value={client.health.goal} />
                {client.health.targetWeightKg != null && (
                  <InfoRow
                    label="Target weight"
                    value={`${client.health.targetWeightKg} kg`}
                  />
                )}
                <InfoRow
                  label="Preferred timeline"
                  value={client.health.preferredTimeline}
                />
              </div>
            </div>

            {/* Programs */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Programs</h2>
              {client.programs.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No programs assigned yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {client.programs.map((program) => (
                    <ProgramCard
                      key={program.userProgramId}
                      program={program}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}