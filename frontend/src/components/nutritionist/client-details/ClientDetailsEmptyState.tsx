import { ArrowLeft, UserRoundX } from "lucide-react";

interface ClientDetailsEmptyStateProps {
  onBack: () => void;
  onRetry: () => void;
  error: boolean;
}

export default function ClientDetailsEmptyState({
  onBack,
  onRetry,
  error,
}: ClientDetailsEmptyStateProps) {
  return (
    <section className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <UserRoundX size={26} aria-hidden="true" />
      </div>

      <h1 className="text-lg font-bold text-slate-900">
        {error ? "Unable to load client" : "Client not found"}
      </h1>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {error
          ? "We couldn't retrieve this client's details. Please try again, or return to the clients page."
          : "This client may no longer be available, or the profile link may be incorrect."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {error && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        )}

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to clients
        </button>
      </div>
    </section>
  );
}