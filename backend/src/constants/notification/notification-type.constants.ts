export const NOTIFICATION_TYPES = [
  "system",
  "info",
  "success",
  "warning",
  "error",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NotificationType = {
  SYSTEM: "system",
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;
