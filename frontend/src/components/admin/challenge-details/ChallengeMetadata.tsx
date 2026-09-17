import {
    CalendarDays,
    Hash,
} from "lucide-react";

import { AdminChallengeDetailsDTO } from "@/dtos/admin/challenge/admin-challenge-details.dto";

interface ChallengeMetadataProps {
    challenge: AdminChallengeDetailsDTO;
}

export function ChallengeMetadata({
    challenge,
}: ChallengeMetadataProps) {
    return (
        <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                    Status
                </h2>

                <div className="mt-5">
                    <StatusBadge
                        status={challenge.status}
                    />

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        {challenge.status ===
                            "draft" &&
                            "This challenge is still being prepared and is not visible to participants."}

                        {challenge.status ===
                            "published" &&
                            "This challenge is currently published and available to participants."}

                        {challenge.status ===
                            "archived" &&
                            "This challenge has been archived and is no longer active."}
                    </p>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                    Metadata
                </h2>

                <div className="mt-5 space-y-5">
                    <InfoRow
                        icon={<Hash className="h-4 w-4" />}
                        label="Challenge ID"
                        value={challenge.id}
                    />



                    <InfoRow
                        icon={
                            <CalendarDays className="h-4 w-4" />
                        }
                        label="Created"
                        value={formatDate(
                            challenge.createdAt,
                        )}
                    />

                    <InfoRow
                        icon={
                            <CalendarDays className="h-4 w-4" />
                        }
                        label="Last Updated"
                        value={formatDate(
                            challenge.updatedAt,
                        )}
                    />
                </div>
            </section>
        </aside>
    );
}

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: string;
}) {
    const styles = {
        published:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        draft:
            "border-amber-200 bg-amber-50 text-amber-700",
        archived:
            "border-slate-200 bg-slate-100 text-slate-600",
    };

    const style =
        styles[status as keyof typeof styles] ??
        "border-slate-200 bg-slate-50 text-slate-600";

    return (
        <span
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold capitalize ${style}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    );
}