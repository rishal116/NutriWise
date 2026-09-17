import Link from "next/link";

import { Sparkles } from "lucide-react";

interface ChallengeListEmptyProps {
    onClearFilters: () => void;
}

export function ChallengeListEmpty({
    onClearFilters,
}: ChallengeListEmptyProps) {
    return (
        <div className="my-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-600">
                <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="mt-3.5 text-sm font-semibold text-slate-900">
                No challenges found
            </h3>

            <p className="mt-1 max-w-xs text-xs text-slate-500">
                Try adjusting your filters or create a
                new challenge.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Clear Filters
                </button>

                <Link
                    href="/admin/challenges/create"
                    className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
                >
                    Create Challenge
                </Link>
            </div>
        </div>
    );
}