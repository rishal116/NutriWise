import Link from "next/link";
import { Plus } from "lucide-react";

export default function PlanHeader() {
  return (
    <header className="flex flex-col justify-between gap-6 rounded-2xl bg-emerald-900 p-6 text-white md:flex-row md:items-center md:p-10">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
          Nutrition Dashboard
        </span>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          My Nutrition Plans
        </h1>

        <p className="max-w-md text-sm text-emerald-100/70">
          Create, edit, and track your nutrition plans from one place.
        </p>
      </div>

      <Link
        href="/nutritionist/plans/create"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-emerald-900 transition-colors hover:bg-emerald-50"
      >
        <Plus size={18} strokeWidth={2.5} />
        New Plan
      </Link>
    </header>
  );
}