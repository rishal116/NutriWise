import Link from "next/link";
import { ArrowLeft, ListChecks } from "lucide-react";

interface ProgramDayErrorProps {
  programId: string;
}

export default function ProgramDayError({ programId }: ProgramDayErrorProps) {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <Link
        href={`/user/programs/${programId}/days`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Days
      </Link>
      <div className="mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 py-20 text-center">
        <ListChecks className="h-8 w-8 text-emerald-600" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          {"Couldn't load program day"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          The day may not exist, or something went wrong while loading it.
        </p>
      </div>
    </div>
  );
}
