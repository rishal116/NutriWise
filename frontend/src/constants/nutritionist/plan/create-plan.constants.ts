export const MIN_PLAN_DURATION_DAYS = 1;
export const MAX_PLAN_DURATION_DAYS = 365;

export const PLAN_DURATION_SUGGESTIONS = [7, 14, 30, 60, 90, 180, 365] as const;

export const getDurationLabel = (days: number): string => {
  const labels: Record<number, string> = {
    7: "1 week",
    14: "2 weeks",
    30: "1 month",
    60: "2 months",
    90: "3 months",
    180: "6 months",
    365: "1 year",
  };

  return labels[days] ? `${days} days (${labels[days]})` : `${days} days`;
};
