"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CircleAlert,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { userSessionService } from "@/services/user/user-session.service";

import type { UserSessionDetailsDTO } from "@/dtos/user/session/user-session-details.dto";

import UserSessionOverview from "./UserSessionOverview";
import UserSessionInformation from "./UserSessionInformation";

interface UserSessionDetailsClientProps {
  sessionId: string;
}

export default function UserSessionDetailsClient({
  sessionId,
}: UserSessionDetailsClientProps) {
  const [session, setSession] = useState<UserSessionDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const requestIdRef = useRef(0);

  const fetchDetails = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);

    try {
      const response =
        await userSessionService.getUserSessionDetails(sessionId);

      if (!response.data) {
        throw new Error("Session details were not returned.");
      }

      if (requestId !== requestIdRef.current) return;

      setSession(response.data);
    } catch {
      if (requestId !== requestIdRef.current) return;

      setError(
        "Unable to load this session. It may not exist or you may not have access to it.",
      );
      setSession(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [sessionId]);

  useEffect(() => {
    void fetchDetails();

    return () => {
      requestIdRef.current += 1;
    };
  }, [fetchDetails, refreshKey]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-96 max-w-7xl items-center justify-center px-4 py-8">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircle size={22} className="animate-spin text-emerald-600" />
          Loading session details...
        </div>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/user/sessions"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to my sessions
        </Link>

        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-white p-6 sm:p-8"
        >
          <CircleAlert size={30} className="text-red-500" />

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Session unavailable
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {error ?? "The requested session could not be found."}
          </p>

          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/user/sessions"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
      >
        <ArrowLeft size={17} />
        Back to my sessions
      </Link>

      <UserSessionOverview session={session} />

      <UserSessionInformation session={session} />
    </main>
  );
}