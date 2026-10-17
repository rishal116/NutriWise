import { LoaderCircle } from "lucide-react";

export default function NutritionistLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle
          className="h-8 w-8 animate-spin text-emerald-600"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-slate-500">Loading page...</p>
      </div>
    </div>
  );
}
