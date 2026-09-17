import Link from "next/link";

import { ArrowRight, Trophy } from "lucide-react";

export default function UserChallengeEmpty() {
  return (
    <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
          <Trophy className="h-7 w-7 text-emerald-600" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          No challenges yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Start a challenge and build healthy habits one step at a
          time.
        </p>

        <Link
          href="/challenges"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Explore challenges
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}