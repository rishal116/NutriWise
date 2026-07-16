import { CoachLevel } from "../../../types/nutritionist.types";

export const MAX_PUBLISHED_PLANS = 3;

export const MIN_PLAN_PRICE = 50;

export const MAX_PLAN_PRICE: Record<CoachLevel, number> = {
  beginner: 999,
  verified: 1999,
  expert: 3999,
  top_coach: 9999,
};
