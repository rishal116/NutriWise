import { Globe2 } from "lucide-react";

interface PublicGroupHeaderProps {
  count: number;
}

export default function PublicGroupHeader({
  count,
}: PublicGroupHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
          <Globe2 size={14} />
          NutriWise community
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Discover Groups
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
          Explore public nutrition and wellness groups and find a
          community that fits your interests.
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {count} active {count === 1 ? "group" : "groups"}
      </div>
    </div>
  );
}