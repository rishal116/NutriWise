import { PlanMetadataDTO } from "../../../dtos/nutritionist/plan/plan-metadata.dto";
import { toNutritionistPricingDTO } from "./nutritionist-plan.mapper";
import {
  MIN_PLAN_PRICE,
  MAX_PLAN_PRICE,
} from "../../../constants/nutritionist/plan/nutritionist-plan.constant";
import { INutritionistProfile } from "../../../models/nutritionistProfile.model";

export const toPlanMetadataDTO = (
  profile: INutritionistProfile,
): PlanMetadataDTO => ({
  pricing: toNutritionistPricingDTO(
    profile.coachLevel,
    MIN_PLAN_PRICE,
    MAX_PLAN_PRICE[profile.coachLevel],
  ),

  specializations: profile.specializations,
});
