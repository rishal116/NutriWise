import {
  UserActivityTrackingStatus,
} from "@/types/user/program/user-program-day.types";

export interface UpdateActivityTrackingDTO {
  status?: UserActivityTrackingStatus;

  recordedValue?: number;
  actualDurationMinutes?: number;

  evidence?: string[];

  notes?: string;
}