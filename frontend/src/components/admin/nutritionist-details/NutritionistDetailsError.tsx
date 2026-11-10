import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

interface NutritionistDetailsErrorProps {
  error: string | null;
  onRetry: () => void;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

export default function NutritionistDetailsError({
  error,
  onRetry,
}: NutritionistDetailsErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-admin-border bg-admin-surface p-6 text-center shadow-sm shadow-admin-text/5 sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-admin-danger-soft text-admin-danger">
          <XCircle size={24} />
        </div>

        <h1 className="mt-4 text-lg font-semibold text-admin-text">
          {error ? "Something went wrong" : "Nutritionist not found"}
        </h1>
        <p className="mt-2 text-sm text-admin-muted">
          {error ?? "This profile may have been removed or is unavailable."}
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
          {error && (
            <button
              type="button"
              onClick={onRetry}
              className={`rounded-xl bg-admin-accent px-4 py-2 text-sm font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover ${FOCUS_RING}`}
            >
              Try again
            </button>
          )}

          <Link
            href="/admin/nutritionists"
            className={`inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-admin-muted transition-colors hover:text-admin-accent ${FOCUS_RING}`}
          >
            <ArrowLeft size={16} />
            Back to nutritionists
          </Link>
        </div>
      </div>
    </div>
  );
}