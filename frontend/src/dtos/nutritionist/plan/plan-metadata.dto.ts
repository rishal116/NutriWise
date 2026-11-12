
import type { CoachLevel, Specialization } from "@/types/nutritionist.types";

export interface NutritionistPricingDto {
  coachLevel: CoachLevel;
  minPrice: number;
  maxPricePerDay: number;
}

export interface PlanMetadataDto {
  pricing: NutritionistPricingDto;
  specializations: Specialization[];
}
