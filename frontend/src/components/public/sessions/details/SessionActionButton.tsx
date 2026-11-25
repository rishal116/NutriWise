
"use client";

import {
  CheckCircle2,
  Clock,
  CreditCard,
  Video,
} from "lucide-react";

interface SessionActionButtonProps {
  isRegistered: boolean;
  isPaid: boolean;
  isLive: boolean;
  canJoin: boolean;
  joining: boolean;
  now: number;
  joinOpensAt: number;
  price?: number;
  onClick: () => void;
}

export default function SessionActionButton({
  isRegistered,
  isPaid,
  isLive,
  canJoin,
  joining,
  now,
  joinOpensAt,
  price,
  onClick,
}: SessionActionButtonProps) {
  const minutesUntilJoin = Math.max(
    0,
    Math.ceil((joinOpensAt - now) / 60_000),
  );

  const disabled = joining || (isRegistered && !canJoin);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {joining ? (
        "Processing..."
      ) : isRegistered && canJoin ? (
        <>
          <Video className="h-4 w-4" />
          {isLive ? "Join Live Session" : "Join Session"}
        </>
      ) : isRegistered ? (
        <>
          <Clock className="h-4 w-4" />
          {now < joinOpensAt
            ? `Join opens in ${minutesUntilJoin} min`
            : "Waiting for session to go live"}
        </>
      ) : isPaid ? (
        <>
          <CreditCard className="h-4 w-4" />
          {price !== undefined
            ? `Pay ₹${price.toLocaleString("en-IN")} & Register`
            : "Continue to Checkout"}
        </>
      ) : (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Register for Session
        </>
      )}
    </button>
  );
}
