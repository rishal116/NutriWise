import { CheckCircle2, Loader2, Users } from "lucide-react";

interface SessionRegistrationCardProps {
  isRegistered: boolean;
  canRegister: boolean;
  isPaid: boolean;
  isLive: boolean;
  isCompleted: boolean;
  isCancelled: boolean;
  joining: boolean;
  priceLabel: string;
  participantCount: number;
  onJoin: () => void;
}

export default function SessionRegistrationCard({
  isRegistered,
  canRegister,
  isPaid,
  isLive,
  isCompleted,
  isCancelled,
  joining,
  priceLabel,
  participantCount,
  onJoin,
}: SessionRegistrationCardProps) {
  const showAction =
    !isCompleted && !isCancelled && (isRegistered || canRegister);

  const actionLabel = isRegistered
    ? "Go to my session"
    : isPaid
      ? "Continue to payment"
      : "Register for free";

  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Session fee
      </p>

      <p
        className={`mt-2 text-3xl font-bold tracking-tight ${
          isPaid ? "text-slate-900" : "text-emerald-600"
        }`}
      >
        {priceLabel}
      </p>

      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
        <Users className="h-4 w-4" />
        {participantCount} registered
      </p>

      <div className="mt-6">
        {showAction && (
          <button
            type="button"
            onClick={onJoin}
            disabled={joining}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${
              isRegistered && isLive
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {joining ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : isRegistered ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {actionLabel}
              </>
            ) : (
              actionLabel
            )}
          </button>
        )}

        {isCompleted && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-500">
            This session has ended.
          </p>
        )}

        {isCancelled && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
            This session has been cancelled.
          </p>
        )}
      </div>
    </section>
  );
}
