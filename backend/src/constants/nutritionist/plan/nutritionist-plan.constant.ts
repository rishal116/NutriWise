import type { CoachLevel } from "../profile/coach-level.constants";

export const MAX_PUBLISHED_PLANS = 3;

export const MIN_PLAN_PRICE = 50;

export const MAX_PLAN_PRICE_PER_DAY: Record<CoachLevel, number> = {
  beginner: 50,
  verified: 75,
  expert: 100,
  top_coach: 150,
};
