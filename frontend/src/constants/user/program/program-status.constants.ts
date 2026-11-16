export const PROGRAM_STATUSES = [
  "preparing",
  "ready",
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;

export type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

export const BLOCKING_PURCHASE_STATUSES = [
  "preparing",
  "ready",
  "upcoming",
  "active",
  "paused",
] as const;

export type BlockingPurchaseStatus =
  (typeof BLOCKING_PURCHASE_STATUSES)[number];
