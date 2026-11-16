export const TIMELINES = [
  "4_weeks",
  "8_weeks",
  "12_weeks",
  "16_weeks",
  "20_weeks",
  "24_weeks",
] as const;

export type TimelineType = (typeof TIMELINES)[number];
