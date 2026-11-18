export const NOTIFICATION_TYPES = [
  "system",
  "info",
  "success",
  "warning",
  "error",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
