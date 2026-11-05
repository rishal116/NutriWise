import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

interface UserDetailsErrorProps {
  error: string | null;
  onRetry: () => void;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

export default function UserDetailsError({
  error,
  onRetry,
}: UserDetailsErrorProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-admin-border bg-admin-surface p-6 text-center shadow-sm shadow-admin-text/5 sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-admin-danger-soft text-admin-danger">
          <XCircle size={24} />
        </div>

        <h1 className="mt-4 text-lg font-semibold text-admin-text">
          {error ? "Something went wrong" : "User not found"}
        </h1>
        <p className="mt-2 text-sm text-admin-muted">
          {error ?? "This user may have been removed or is unavailable."}
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
          {error && (
            <button
              type="button"
              onClick={onRetry}
              className={`rounded-xl bg-admin-accent px-4 py-2 text-sm font-semibold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover ${focusRing}`}
            >
              Try again
            </button>
          )}

          <Link
            href="/admin/users"
            className={`inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-admin-muted transition-colors hover:text-admin-accent ${focusRing}`}
          >
            <ArrowLeft size={16} />
            Back to users
          </Link>
        </div>
      </div>
    </div>
  );
}