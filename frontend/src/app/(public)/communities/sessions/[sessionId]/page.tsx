"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  UserRound,
  Users,
  Video,
} from "lucide-react";

import { publicSessionService } from "@/services/public/publicSession.service";
import { sessionRegistrationService } from "@/services/public/sessionRegistration.service";
import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import type { SessionRegistrationResponseDTO } from "@/dtos/public/session-registration/session-registration-response.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAppSelector } from "@/redux/hooks";

interface SessionRegistrationResult {
  registration?: SessionRegistrationResponseDTO;
  checkoutUrl?: string;
}

export default function PublicSessionDetailsPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const sessionId = params.sessionId;

  const [session, setSession] =
    useState<PublicSessionDetailsResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const initialized = useAppSelector((state) => state.auth.initialized);

  // Update the countdown without repeatedly requesting session details.
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 15_000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!initialized || !sessionId) return;
    let cancelled = false;

    const fetchSession = async () => {
      setLoading(true);
      setError(null);
      setSession(null);

      try {
        const response =
          await publicSessionService.getSessionDetails(sessionId);

        if (cancelled) return;

        if (!response.data) {
          throw new Error("Session details were not returned by the server.");
        }

        setSession(response.data);
      } catch (fetchError: unknown) {
        if (!cancelled) {
          console.error(
            "Failed to fetch session:",
            getErrorMessage(fetchError),
          );
          setError("Unable to load this session. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (!sessionId) {
      setError("Invalid session.");
      setLoading(false);

      return () => {
        cancelled = true;
      };
    }

    void fetchSession();

    return () => {
      cancelled = true;
    };
  }, [initialized, sessionId]);

  const handleJoin = useCallback(async () => {
    if (!session || joining) return;

    const currentTime = Date.now();
    const scheduledTime = new Date(session.scheduledAt).getTime();
    const joinOpensAt = scheduledTime - 5 * 60 * 1000;

    const isLive = session.status === "live";
    const isScheduled = session.status === "scheduled";
    const isFinished =
      session.status === "completed" || session.status === "cancelled";

    // The backend is the source of truth for registration.
    if (session.isRegistered) {
      if (isFinished) return;

      if (isLive || (isScheduled && currentTime >= joinOpensAt)) {
        router.push(`/session-room/${session.sessionId}`);
      }

      return;
    }

    // Only scheduled or live sessions accept new registrations.
    if ((!isScheduled && !isLive) || isFinished) return;

    // Paid sessions must complete checkout before registration is confirmed.
    if (session.pricing.type === "paid") {
      router.push(`/communities/sessions/${session.sessionId}/checkout`);
      return;
    }

    try {
      setJoining(true);
      setError(null);

      const response = await sessionRegistrationService.registerForSession(
        session.sessionId,
      );

      const result = response.data as SessionRegistrationResult | undefined;

      if (!result?.registration) {
        throw new Error("Registration response is missing registration data.");
      }

      // Update the local UI after successful registration.
      setSession((currentSession) =>
        currentSession
          ? {
              ...currentSession,
              isRegistered: true,
            }
          : currentSession,
      );
    } catch (joinError: unknown) {
      const message = getErrorMessage(joinError);
      console.error("Failed to register for session:", message);
      setError(message);
    } finally {
      setJoining(false);
    }
  }, [session, joining, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-32 rounded bg-gray-200" />
          <div className="h-72 rounded-3xl bg-gray-200" />
          <div className="h-8 w-2/3 rounded bg-gray-200" />
          <div className="h-24 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mt-12 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Session unavailable
          </h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const scheduledDate = new Date(session.scheduledAt);
  const scheduledTime = scheduledDate.getTime();
  const joinOpensAt = scheduledTime - 5 * 60 * 1000;

  const formattedDate = scheduledDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = scheduledDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isPaid = session.pricing.type === "paid";
  const isLive = session.status === "live";
  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled";
  const isScheduled = session.status === "scheduled";
  const isRegistered = session.isRegistered;

  const canRegister = (isScheduled || isLive) && !isRegistered;

  const canJoin =
    isRegistered &&
    !isCompleted &&
    !isCancelled &&
    (isLive || (isScheduled && now >= joinOpensAt));

  const minutesUntilJoin = Math.max(0, Math.ceil((joinOpensAt - now) / 60_000));

  const showSessionAction =
    !isCompleted && !isCancelled && (canRegister || isRegistered);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-5 flex items-center gap-2 text-sm text-gray-600 transition hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sessions
      </button>

      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="relative h-64 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 sm:h-80">
          {session.thumbnailUrl ? (
            <Image
              src={session.thumbnailUrl}
              alt={session.title}
              fill
              sizes="(max-width: 640px) 100vw, 896px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Video className="h-16 w-16 text-emerald-300" />
            </div>
          )}

          <div className="absolute left-5 top-5">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
                isLive
                  ? "bg-red-500 text-white"
                  : isCompleted || isCancelled
                    ? "bg-gray-800 text-white"
                    : "bg-white/90 text-emerald-700"
              }`}
            >
              {isLive ? "LIVE NOW" : session.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {session.type.replaceAll("_", " ")}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {session.title}
          </h1>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            {session.description}
          </p>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<CalendarDays className="h-5 w-5" />}
              label="Date"
              value={formattedDate}
            />

            <InfoItem
              icon={<Clock className="h-5 w-5" />}
              label="Time"
              value={formattedTime}
            />

            <InfoItem
              icon={<Clock className="h-5 w-5" />}
              label="Duration"
              value={`${session.durationInMinutes} minutes`}
            />

            <InfoItem
              icon={<Users className="h-5 w-5" />}
              label="Maximum participants"
              value={
                session.maxParticipants
                  ? `${session.maxParticipants} participants`
                  : "No limit"
              }
            />
          </div>

          <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Hosted by
            </p>

            <div className="mt-4 flex items-start gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-emerald-100">
                {session.nutritionist.profileImage ? (
                  <Image
                    src={session.nutritionist.profileImage}
                    alt={session.nutritionist.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound className="h-6 w-6 text-emerald-600" />
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  {session.nutritionist.name}
                </h2>

                {session.nutritionist.bio && (
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {session.nutritionist.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-5 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-gray-400">Session fee</p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  isPaid ? "text-gray-900" : "text-emerald-600"
                }`}
              >
                {isPaid ? `₹${session.pricing.amount}` : "Free"}
              </p>
            </div>

            {showSessionAction && (
              <button
                type="button"
                onClick={() => void handleJoin()}
                disabled={joining || (isRegistered && !canJoin)}
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
                    {`Pay ₹${session.pricing.amount} & Register`}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Register for Session
                  </>
                )}
              </button>
            )}

            {isCompleted && (
              <p className="text-sm font-medium text-gray-500">
                This session has ended.
              </p>
            )}

            {isCancelled && (
              <p className="text-sm font-medium text-red-600">
                This session has been cancelled.
              </p>
            )}

            {error && session && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
      <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
