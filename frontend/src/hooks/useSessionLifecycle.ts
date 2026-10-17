import { useCallback, useEffect, useRef, useState } from "react";

import { publicSessionService } from "@/services/public/publicSession.service";
import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import { getErrorMessage } from "@/utils/getErrorMessage";

export type SessionStatus = PublicSessionDetailsResponseDTO["status"];
export type SessionLifecycleAction = "start" | "end";

interface UseSessionLifecycleOptions {
  sessionId: string;
  initialStatus: SessionStatus;
  isHost: boolean;
}

export function useSessionLifecycle({
  sessionId,
  initialStatus,
  isHost,
}: UseSessionLifecycleOptions) {
  const [status, setStatus] = useState<SessionStatus>(initialStatus);
  const [pendingAction, setPendingAction] =
    useState<SessionLifecycleAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const canStart = isHost && status === "scheduled";
  const canEnd = isHost && status === "live";

  const run = useCallback(
    async (action: SessionLifecycleAction): Promise<boolean> => {
      const allowed = action === "start" ? canStart : canEnd;

      if (!allowed || inFlightRef.current) return false;

      inFlightRef.current = true;
      setPendingAction(action);
      setError(null);

      try {
        if (action === "start") {
          await publicSessionService.startSession(sessionId);
        } else {
          await publicSessionService.endSession(sessionId);
        }

        // Status changes only after the backend confirmed the transition.
        if (mountedRef.current) {
          setStatus(action === "start" ? "live" : "completed");
        }

        return true;
      } catch (err: unknown) {
        if (mountedRef.current) {
          setError(getErrorMessage(err));
        }

        return false;
      } finally {
        inFlightRef.current = false;

        if (mountedRef.current) {
          setPendingAction(null);
        }
      }
    },
    [canEnd, canStart, sessionId],
  );

  const start = useCallback(() => run("start"), [run]);
  const end = useCallback(() => run("end"), [run]);
  const clearError = useCallback(() => setError(null), []);

  return {
    status,
    pendingAction,
    error,
    canStart,
    canEnd,
    start,
    end,
    clearError,
  };
}
