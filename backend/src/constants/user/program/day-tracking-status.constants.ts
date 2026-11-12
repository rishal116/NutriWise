export const DAY_TRACKING_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "missed",
  "skipped",
] as const;

export type DayTrackingStatus = (typeof DAY_TRACKING_STATUSES)[number];

export const UserDayTrackingStatus = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  MISSED: "missed",
  SKIPPED: "skipped",
} as const;

export type UserDayTrackingStatus = DayTrackingStatus;
