interface SessionErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function SessionErrorState({
  message,
  onRetry,
}: SessionErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white px-6 py-12 text-center">
      <h3 className="font-semibold text-slate-900">Unable to load sessions</h3>

      <p className="mt-2 text-sm text-slate-500">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        Try again
      </button>
    </div>
  );
}
