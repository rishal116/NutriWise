import { Specialization } from "@/types/nutritionist.types";

export interface NutritionistPricingDto {
  coachLevel: string;
  minPrice: number;
  maxPrice: number;
}

export interface PlanMetadataDto {
  pricing: NutritionistPricingDto;
  specializations: Specialization[];
}