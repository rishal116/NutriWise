import type { PlanMetadataDTO } from "../../../dtos/nutritionist/plan/plan-metadata.dto";
import type { INutritionistProfile } from "../../../models/nutritionistProfile.model";
import { toNutritionistPricingDTO } from "./nutritionist-pricing.mapper";

import {
  MIN_PLAN_PRICE,
  MAX_PLAN_PRICE_PER_DAY,
} from "../../../constants/nutritionist/plan/nutritionist-plan.constant";

export const toPlanMetadataDTO = (
  profile: INutritionistProfile,
): PlanMetadataDTO => ({
  pricing: toNutritionistPricingDTO(
    profile.coachLevel,
    MIN_PLAN_PRICE,
    MAX_PLAN_PRICE_PER_DAY[profile.coachLevel],
  ),
  specializations: profile.specializations,
});
