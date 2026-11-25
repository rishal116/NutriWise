
import { ArrowLeft } from "lucide-react";

interface CreateSessionHeaderProps {
  onBack: () => void;
}

export function CreateSessionHeader({
  onBack,
}: CreateSessionHeaderProps) {
  return (
    <header className="flex items-start gap-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Create Session
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a free or paid session for your clients.
        </p>
      </div>
    </header>
  );
}
