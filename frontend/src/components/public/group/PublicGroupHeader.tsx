import { Globe2 } from "lucide-react";

export default function PublicGroupHeader() {
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600">
        <Globe2 size={14} aria-hidden="true" />
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
  );
}