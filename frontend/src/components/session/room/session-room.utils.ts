import type { SessionStatus } from "@/constants/common/session.constants";

export type LeaveReason = "left" | "ended" | "disconnected";

const JOINABLE_STATUSES: readonly SessionStatus[] = ["scheduled", "live"];

export const isJoinableStatus = (status: SessionStatus): boolean =>
  JOINABLE_STATUSES.includes(status);

export function getUnavailableMessage(status: SessionStatus): {
  title: string;
  message: string;
} {
  switch (status) {
    case "completed":
      return {
        title: "This session has ended",
        message: "The session is over, so it can't be rejoined.",
      };
    case "cancelled":
      return {
        title: "This session was cancelled",
        message: "The host cancelled this session.",
      };
    default:
      return {
        title: "This session isn't open yet",
        message: "The session hasn't been published. Check back later.",
      };
  }
}