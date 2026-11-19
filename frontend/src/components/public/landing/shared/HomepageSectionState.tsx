import { AlertCircle, Inbox } from "lucide-react";

interface HomepageSectionStateProps {
  type: "loading" | "error" | "empty";
  message?: string;
  onRetry?: () => void;
}

export default function HomepageSectionState({
  type,
  message,
  onRetry,
}: HomepageSectionStateProps) {
  if (type === "loading") {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-2xl border border-slate-100 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50/60 px-5 py-10 text-center">
        <AlertCircle className="mb-3 text-red-500" size={28} />

        <p className="font-semibold text-slate-800">
          Unable to load this section
        </p>

        <p className="mt-2 text-sm text-slate-500">
          {message || "Something went wrong. Please try again."}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-12 text-center">
      <Inbox className="mb-3 text-emerald-600" size={30} />

      <p className="font-semibold text-slate-800">Nothing to show yet</p>

      <p className="mt-2 text-sm text-slate-500">
        {message || "Check back soon for new content."}
      </p>
    </div>
  );
}
