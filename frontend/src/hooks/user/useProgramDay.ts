import { useCallback, useEffect, useState } from "react";
import type {
  UserProgramDayActivityResponseDTO,
  UserProgramDayDetailsResponseDTO,
} from "@/dtos/user/program/user-program-day-details.dto";
import type { UpdateActivityTrackingDTO } from "@/dtos/user/tracking/update-activity-tracking.dto";
import { userProgramDayService } from "@/services/user/user-program-day.service";
import { userActivityTrackingService } from "@/services/user/userActivityTracking.service";
import { UserActivityTrackingStatus } from "@/types/user/program/user-program-day.types";
import type { ActivityAction } from "@/components/user/program-day/program-day.types";

interface UseProgramDayParams {
  params: Promise<{
    programId: string;
    dayNumber: string;
  }>;
}

export function useProgramDay({ params }: UseProgramDayParams) {
  const [day, setDay] = useState<UserProgramDayDetailsResponseDTO | null>(null);
  const [programId, setProgramId] = useState("");
  const [dayNumber, setDayNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pendingActivityId, setPendingActivityId] = useState<string | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const loadDay = useCallback(async (id: string, number: number) => {
    const response = await userProgramDayService.getDayDetails(id, number);
    if (!response.data) {
      throw new Error("Program day response did not contain data");
    }
    setDay(response.data);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const { programId: id, dayNumber: rawNumber } = await params;
        const number = Number(rawNumber);

        if (!id || !Number.isInteger(number) || number < 1) {
          throw new Error("Invalid program day parameters");
        }

        if (!active) return;

        setProgramId(id);
        setDayNumber(number);

        const response = await userProgramDayService.getDayDetails(id, number);

        if (active) {
          if (!response.data) {
            throw new Error("Program day response did not contain data");
          }
          setDay(response.data);
        }
      } catch (err) {
        console.error("Failed to load program day:", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, [params]);

  const handleActivityAction = useCallback(
    async (
      activity: UserProgramDayActivityResponseDTO,
      action: ActivityAction,
    ) => {
      if (
        !day ||
        !day.tracking ||
        day.tracking.isLocked ||
        pendingActivityId !== null ||
        activity.tracking.status === UserActivityTrackingStatus.COMPLETED
      ) {
        return;
      }

      const previousDay = day;
      const now = new Date().toISOString();

      setActionError(null);
      setPendingActivityId(activity._id);

      const optimisticStatus =
        action.type === "start"
          ? UserActivityTrackingStatus.IN_PROGRESS
          : action.type === "complete"
            ? UserActivityTrackingStatus.COMPLETED
            : UserActivityTrackingStatus.SKIPPED;

      setDay({
        ...previousDay,
        activities: previousDay.activities.map((item) => {
          if (item._id !== activity._id) {
            return item;
          }

          return {
            ...item,
            tracking: {
              ...item.tracking,
              status: optimisticStatus,
              ...(action.type === "start"
                ? {
                    startedAt: item.tracking.startedAt ?? now,
                  }
                : {}),
              ...(action.type === "complete"
                ? {
                    ...(action.recordedValue !== undefined && {
                      recordedValue: action.recordedValue,
                    }),
                    ...(action.recordedText !== undefined && {
                      recordedText: action.recordedText,
                    }),
                    ...(action.notes !== undefined && {
                      notes: action.notes,
                    }),
                    ...(action.evidence !== undefined && {
                      evidence: action.evidence,
                    }),
                    startedAt: item.tracking.startedAt ?? now,
                    completedAt: now,
                    skippedReason: undefined,
                  }
                : {}),
              ...(action.type === "skip"
                ? {
                    skippedReason: action.skippedReason,
                  }
                : {}),
            },
          };
        }),
      });

      try {
        if (action.type === "start") {
          await userActivityTrackingService.startActivity(
            programId,
            previousDay._id,
            activity._id,
          );
        } else if (action.type === "complete") {
          const payload: UpdateActivityTrackingDTO = {
            status: UserActivityTrackingStatus.COMPLETED,
            ...(action.recordedValue !== undefined && {
              recordedValue: action.recordedValue,
            }),
            ...(action.recordedText !== undefined && {
              recordedText: action.recordedText,
            }),
            ...(action.notes !== undefined && {
              notes: action.notes,
            }),
            ...(action.evidence !== undefined && {
              evidence: action.evidence,
            }),
          };

          await userActivityTrackingService.updateActivity(
            programId,
            previousDay._id,
            activity._id,
            payload,
          );
        } else {
          await userActivityTrackingService.skipActivity(
            programId,
            previousDay._id,
            activity._id,
            action.skippedReason,
          );
        }

        await loadDay(programId, dayNumber);
      } catch (err) {
        console.error("Failed to update activity:", err);
        setDay(previousDay);
        setActionError("Couldn't save that update. Please try again.");
      } finally {
        setPendingActivityId(null);
      }
    },
    [day, programId, dayNumber, pendingActivityId, loadDay],
  );

  return {
    day,
    programId,
    dayNumber,
    loading,
    error,
    pendingActivityId,
    actionError,
    handleActivityAction,
    loadDay,
  };
}
