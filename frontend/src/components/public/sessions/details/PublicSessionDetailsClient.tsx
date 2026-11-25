"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { publicSessionService } from "@/services/public/publicSession.service";
import { sessionRegistrationService } from "@/services/public/sessionRegistration.service";

import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";

import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAppSelector } from "@/redux/hooks";

import SessionDetailsSkeleton from "./SessionDetailsSkeleton";
import SessionDetailsError from "./SessionDetailsError";
import SessionHero from "./SessionHero";
import SessionOverview from "./SessionOverview";
import SessionInfoGrid from "./SessionInfoGrid";
import SessionHostCard from "./SessionHostCard";
import SessionRegistrationCard from "./SessionRegistrationCard";

interface PublicSessionDetailsClientProps {
  sessionId: string;
}

export default function PublicSessionDetailsClient({
  sessionId,
}: PublicSessionDetailsClientProps) {
  const router = useRouter();

  const initialized = useAppSelector((state) => state.auth.initialized);

  const [session, setSession] =
    useState<PublicSessionDetailsResponseDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!initialized || !sessionId) return;

    let cancelled = false;

    const loadSession = async () => {
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
        if (cancelled) return;

        console.error("Failed to fetch session:", getErrorMessage(fetchError));

        setError("Unable to load this session. Please try again.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, [initialized, sessionId, retryKey]);

  const handleJoin = useCallback(async () => {
    if (!session || joining) return;

    // Registered users can navigate immediately.
    if (session.isRegistered) {
      router.push(`/user/sessions/${session.sessionId}`);
      return;
    }

    const canRegister =
      session.status === "scheduled" || session.status === "live";

    if (!canRegister) return;

    // Redirect paid sessions to checkout.
    if (session.pricing.type === "paid") {
      router.push(`/communities/sessions/${session.sessionId}/checkout`);
      return;
    }

    try {
      setJoining(true);

      const response = await sessionRegistrationService.registerForSession(
        session.sessionId,
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      if (!response.data?.registration) {
        throw new Error("Registration data is missing from the response.");
      }

      setSession((currentSession) =>
        currentSession
          ? {
              ...currentSession,
              isRegistered: true,
              participantCount: currentSession.participantCount + 1,
            }
          : currentSession,
      );

      toast.success(
        response.message || "Successfully registered for the session.",
      );

      router.push(`/user/sessions/${session.sessionId}`);
    } catch (joinError: unknown) {
      const message = getErrorMessage(joinError);

      console.error("Failed to register for session:", message);
      toast.error(message);
    } finally {
      setJoining(false);
    }
  }, [session, joining, router]);

  if (!initialized || loading) {
    return <SessionDetailsSkeleton />;
  }

  if (error && !session) {
    return (
      <SessionDetailsError
        error={error}
        onBack={() => router.back()}
        onRetry={() => setRetryKey((current) => current + 1)}
      />
    );
  }

  if (!session) return null;

  const isPaid = session.pricing.type === "paid";
  const isLive = session.status === "live";
  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled";
  const isRegistered = session.isRegistered;

  const canRegister =
    (session.status === "scheduled" || isLive) && !isRegistered;

  const priceLabel = isPaid
    ? session.pricing.amount !== undefined
      ? `₹${session.pricing.amount.toLocaleString("en-IN")}`
      : "Price unavailable"
    : "Free";

  return (
    <div className="min-h-screen bg-slate-50/60">
      <nav className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2">
            <SessionHero session={session} />

            <SessionOverview session={session} />

            <SessionInfoGrid session={session} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <SessionRegistrationCard
              isRegistered={isRegistered}
              canRegister={canRegister}
              isPaid={isPaid}
              isLive={isLive}
              isCompleted={isCompleted}
              isCancelled={isCancelled}
              joining={joining}
              priceLabel={priceLabel}
              participantCount={session.participantCount}
              onJoin={() => void handleJoin()}
            />

            <SessionHostCard session={session} />
          </aside>
        </div>
      </main>
    </div>
  );
}
