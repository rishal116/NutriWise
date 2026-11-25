"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";
import { nutriSessionService } from "@/services/nutritionist/nutri-session.service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { sessionDetailsCache } from "@/utils/nutritionist/session-details-cache";

interface UseSessionDetailsReturn {
  session: NutriSessionDetailsResponseDTO | null;
  loading: boolean;
  error: string | null;
  deleting: boolean;
  publishing: boolean;
  showPublishConfirm: boolean;
  showDeleteConfirm: boolean;
  setShowPublishConfirm: (value: boolean) => void;
  setShowDeleteConfirm: (value: boolean) => void;
  handlePublish: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useSessionDetails(sessionId: string): UseSessionDetailsReturn {
  const router = useRouter();

  const [session, setSession] = useState<NutriSessionDetailsResponseDTO | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchSession = async () => {
      if (!sessionId) {
        setSession(null);
        setError("Invalid session ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const cachedSession = sessionDetailsCache.get(sessionId);

        if (cachedSession) {
          if (cancelled) return;

          setSession(cachedSession);
          return;
        }

        const response = await nutriSessionService.getSessionDetails(sessionId);
        const data = response.data;

        if (!data) {
          throw new Error("Session details are missing from the API response.");
        }

        if (cancelled) return;

        sessionDetailsCache.set(data);
        setSession(data);
      } catch (fetchError: unknown) {
        if (cancelled) return;

        setSession(null);
        setError(getErrorMessage(fetchError));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchSession();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const handlePublish = useCallback(async () => {
    if (!session || session.status !== "draft" || publishing || deleting) {
      return;
    }

    try {
      setPublishing(true);
      setError(null);

      await nutriSessionService.publishSession(session.sessionId);

      sessionDetailsCache.invalidate(session.sessionId);

      const response = await nutriSessionService.getSessionDetails(
        session.sessionId,
      );

      const updatedSession = response.data;

      if (!updatedSession) {
        throw new Error("Session details are missing from the API response.");
      }

      sessionDetailsCache.set(updatedSession);
      setSession(updatedSession);
      setShowPublishConfirm(false);
    } catch (publishError: unknown) {
      setError(getErrorMessage(publishError));
    } finally {
      setPublishing(false);
    }
  }, [session, publishing, deleting]);

  const handleDelete = useCallback(async () => {
    if (!session || deleting || publishing) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);

      await nutriSessionService.deleteSession(session.sessionId);

      sessionDetailsCache.invalidate(session.sessionId);

      router.push("/nutritionist/sessions");
    } catch (deleteError: unknown) {
      setError(getErrorMessage(deleteError));
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [session, deleting, publishing, router]);

  return {
    session,
    loading,
    error,
    deleting,
    publishing,
    showPublishConfirm,
    showDeleteConfirm,
    setShowPublishConfirm,
    setShowDeleteConfirm,
    handlePublish,
    handleDelete,
  };
}
