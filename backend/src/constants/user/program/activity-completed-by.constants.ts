export const ACTIVITY_COMPLETED_BY = [
  "user",
  "nutritionist",
  "system",
] as const;

export type ActivityCompletedBy = (typeof ACTIVITY_COMPLETED_BY)[number];
