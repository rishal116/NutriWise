import type { UserActivityTrackingStatus } from "@/types/user/program/user-program-day.types";

export interface UpdateActivityTrackingDTO {
  status?: UserActivityTrackingStatus;

  recordedValue?: number;
  recordedText?: string;
  unit?: string;

  evidence?: string[];

  skippedReason?: string;
  notes?: string;
}
