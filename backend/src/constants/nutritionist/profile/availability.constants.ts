export const AVAILABILITY_STATUSES = ["available", "busy", "offline"] as const;

export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];
