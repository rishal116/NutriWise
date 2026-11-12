export const APPLICATION_STATUSES = [
  "pending",
  "approved",
  "rejected",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
