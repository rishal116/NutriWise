import type { CoachLevel } from "../../../constants/nutritionist/profile/coach-level.constants";
import type { NutritionistPricingDTO } from "../../../dtos/nutritionist/plan/nutritionist-pricing.dto";

export const toNutritionistPricingDTO = (
  coachLevel: CoachLevel,
  minPrice: number,
  maxPricePerDay: number,
): NutritionistPricingDTO => ({
  coachLevel,
  minPrice,
  maxPricePerDay,
});