import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

interface UserDetailsErrorProps {
  error: string | null;
  onRetry: () => void;
}

export default function UserDetailsError({
  error,
  onRetry,
}: UserDetailsErrorProps) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 p-4 sm:p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <XCircle size={24} />
        </div>

        <h1 className="mt-4 text-lg font-semibold text-slate-900">
          {error ? "Something went wrong" : "User not found"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {error ?? "This user may have been removed or is unavailable."}
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
          {error && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Try again
            </button>
          )}

          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Back to users
          </Link>
        </div>
      </div>
    </main>
  );
}
