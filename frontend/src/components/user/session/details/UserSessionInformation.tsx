"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  CreditCard,
  MapPin,
  Users,
  Video,
} from "lucide-react";

import type { UserSessionDetailsDTO } from "@/dtos/user/session/user-session-details.dto";

import UserSessionStatusBadge from "./UserSessionStatusBadge";

interface UserSessionInformationProps {
  session: UserSessionDetailsDTO;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

function getCountdown(targetTime: number): Countdown {
  const difference = Math.max(0, targetTime - Date.now());
  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function CountdownItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-lg bg-white p-3 text-center shadow-sm">
      <p className="text-2xl font-bold tabular-nums text-emerald-700">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 text-xs text-gray-500">{label}</p>
    </div>
  );
}

function SessionAccess({ session }: { session: UserSessionDetailsDTO }) {
  const { session: details } = session;

  const scheduledTime = new Date(details.scheduledAt).getTime();

  const isValidSchedule = Number.isFinite(scheduledTime);

  const canAccess =
    session.registrationStatus === "registered" &&
    details.status !== "cancelled" &&
    details.status !== "completed" &&
    isValidSchedule;

  const [countdown, setCountdown] = useState<Countdown | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!canAccess) return;

    const updateCountdown = () => {
      const arrived = Date.now() >= scheduledTime;

      setHasStarted(arrived);

      if (!arrived) {
        setCountdown(getCountdown(scheduledTime));
      }
    };

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [canAccess, scheduledTime]);

  if (!canAccess) return null;

  if (hasStarted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2">
          <span className="size-2 animate-pulse rounded-full bg-emerald-600" />
          <h2 className="font-semibold text-emerald-900">
            Your session time has arrived
          </h2>
        </div>

        <p className="mt-2 text-sm text-emerald-800">
          You can now enter your session room.
        </p>

        <Link
          href={`/session-room/${details.roomId}`}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Video size={18} />
          Join Live Session
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex items-center gap-2">
        <Clock3 size={19} className="text-emerald-700" />

        <h2 className="font-semibold text-emerald-900">
          Your session starts in
        </h2>
      </div>

      {countdown ? (
        <div className="mt-4 flex gap-2 sm:gap-3">
          <CountdownItem value={countdown.days} label="Days" />
          <CountdownItem value={countdown.hours} label="Hours" />
          <CountdownItem value={countdown.minutes} label="Minutes" />
          <CountdownItem value={countdown.seconds} label="Seconds" />
        </div>
      ) : (
        <p className="mt-3 text-sm text-emerald-800">Preparing countdown...</p>
      )}

      <p className="mt-3 text-xs text-emerald-700">
        The join option will become available when the scheduled time arrives.
      </p>
    </div>
  );
}

export default function UserSessionInformation({
  session,
}: UserSessionInformationProps) {
  const { session: details } = session;

  return (
    <section className="space-y-4">
      <SessionAccess session={session} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">Schedule</h2>

          <div className="mt-5 space-y-5">
            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <CalendarDays size={19} className="text-emerald-700" />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">Date and time</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(details.scheduledAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <Clock3 size={19} className="text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {details.durationInMinutes} minutes
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <MapPin size={19} className="text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Session format</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  Online session
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">Registration details</h2>

          <div className="mt-5 space-y-5">
            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <CalendarDays size={19} className="text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Registered on</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(session.registeredAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <CreditCard size={19} className="text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Registration status</p>
                <div className="mt-1">
                  <UserSessionStatusBadge status={session.registrationStatus} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                <Users size={19} className="text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Maximum participants</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {details.maxParticipants}
                </p>
              </div>
            </div>

            {session.cancelledAt && (
              <div>
                <p className="text-sm text-gray-500">Cancelled on</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(session.cancelledAt)}
                </p>
              </div>
            )}

            {session.attendedAt && (
              <div>
                <p className="text-sm text-gray-500">Attended on</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(session.attendedAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
