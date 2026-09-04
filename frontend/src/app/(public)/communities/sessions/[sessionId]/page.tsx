"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Users,
  Video,
  UserRound,
  CheckCircle2,
  CreditCard,
} from "lucide-react";

import { publicSessionService } from "@/services/public/publicSession.service";
import { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import { sessionRegistrationService } from "@/services/public/sessionRegistration.service";
import { sessionCheckoutService } from "@/services/public/sessionCheckout.service";
import { SessionRegistrationResponseDTO } from "@/dtos/public/session-registration/session-registration-response.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function PublicSessionDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const sessionId = params.sessionId as string;

  const [session, setSession] =
    useState<PublicSessionDetailsResponseDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [joining, setJoining] = useState(false);
  const [registration, setRegistration] =
    useState<SessionRegistrationResponseDTO | null>(null);

  const [registrationLoading, setRegistrationLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await publicSessionService.getSessionDetails(sessionId);

        setSession(response.data);

        try {
          const registrationResponse =
            await sessionRegistrationService.getMySessionRegistration(
              sessionId,
            );

          setRegistration(registrationResponse.data);
        } catch (registrationError: unknown) {}
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setError("Unable to load this session.");
      } finally {
        setLoading(false);
        setRegistrationLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleJoin = async () => {
    if (!session || joining) return;

    try {
      setJoining(true);

      // Already registered → go directly to room
      if (registration?.status === "registered") {
        router.push(`/session-room/${session.sessionId}`);
        return;
      }

      // Not registered → register first
      const response = await sessionRegistrationService.registerForSession(
        session.sessionId,
      );

      if (response.data.registration) {
        setRegistration(response.data.registration);
      }

      // After successful registration → go to room
      router.push(`/session-room/${session.sessionId}`);
    } catch (error) {
      const message = getErrorMessage(error);
      console.error("Failed to join session:", message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-32 rounded bg-gray-200" />

          <div className="h-72 rounded-3xl bg-gray-200" />

          <div className="h-8 w-2/3 rounded bg-gray-200" />

          <div className="h-24 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mt-12 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Session not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This session may no longer be available.
          </p>
        </div>
      </div>
    );
  }

  const scheduledDate = new Date(session.scheduledAt);

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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sessions
      </button>

      {/* Main card */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        {/* Thumbnail */}
        <div className="relative h-64 sm:h-80 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
          {session.thumbnailUrl ? (
            <img
              src={session.thumbnailUrl}
              alt={session.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Video className="h-16 w-16 text-emerald-300" />
            </div>
          )}

          {/* Status */}
          <div className="absolute left-5 top-5">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${
                isLive
                  ? "bg-red-500 text-white"
                  : isCompleted
                    ? "bg-gray-800 text-white"
                    : "bg-white/90 text-emerald-700"
              }`}
            >
              {isLive
                ? "LIVE NOW"
                : isCompleted
                  ? "COMPLETED"
                  : session.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8">
          {/* Type */}
          <div className="mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              {session.type.replace("_", " ")}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {session.title}
          </h1>

          {/* Description */}
          <p className="mt-4 text-sm sm:text-base leading-7 text-gray-600">
            {session.description}
          </p>

          {/* Session information */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Nutritionist */}
          <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Hosted by
            </p>

            <div className="mt-4 flex items-start gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-emerald-100">
                {session.nutritionist.profileImage ? (
                  <img
                    src={session.nutritionist.profileImage}
                    alt={session.nutritionist.name}
                    className="h-full w-full object-cover"
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

          {/* Bottom action */}
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-gray-100 pt-6">
            <div>
              <p className="text-xs text-gray-400">Session fee</p>

              {isPaid ? (
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  ₹{session.pricing.amount}
                </p>
              ) : (
                <p className="mt-1 text-2xl font-bold text-emerald-600">Free</p>
              )}
            </div>

            {!isCompleted && (
              <button
                onClick={handleJoin}
                disabled={registering}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLive ? (
                  <>
                    <Video className="h-4 w-4" />
                    Join Live Session
                  </>
                ) : isPaid ? (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Join for ₹{session.pricing.amount}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Register & Join
                  </>
                )}
              </button>
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
  icon: React.ReactNode;
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
