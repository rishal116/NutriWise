export const ACTIVITY_TRACKING_STATUSES = [
  "not_started",
  "in_progress",
  "completed",
  "skipped",
] as const;

export type ActivityTrackingStatus =
  (typeof ACTIVITY_TRACKING_STATUSES)[number];
