export const PROGRAM_STATUS = [
  "upcoming",
  "active",
  "paused",
  "completed",
  "cancelled",
] as const;

export type ProgramStatus = (typeof PROGRAM_STATUS)[number];

export const SUBSCRIPTION_STATUS = [
  "pending",
  "active",
  "expired",
  "cancelled",
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[number];

export const PROGRAM_STATUS_FILTER = ["all", ...PROGRAM_STATUS] as const;

export type ProgramStatusFilter = (typeof PROGRAM_STATUS_FILTER)[number];

export const SUBSCRIPTION_STATUS_FILTER = [
  "all",
  ...SUBSCRIPTION_STATUS,
] as const;

export type SubscriptionStatusFilter =
  (typeof SUBSCRIPTION_STATUS_FILTER)[number];

export enum ProgramSortBy {
  LATEST = "latest",
  OLDEST = "oldest",
  START_DATE = "start_date",
  END_DATE = "end_date",
  PROGRESS = "progress",
}

export interface GetProgramsQueryDTO {
  cursor?: string;

  limit?: number;

  search?: string;

  programStatus?: ProgramStatusFilter;

  subscriptionStatus?: SubscriptionStatusFilter;

  sortBy?: ProgramSortBy;
}

export interface GetProgramParamsDTO {
  programId: string;
}
