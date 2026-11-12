import type { CoachLevel } from "../../../constants/nutritionist/profile/coach-level.constants";

export interface NutritionistPricingDTO {
  coachLevel: CoachLevel;
  minPrice: number;
  maxPricePerDay: number;
}