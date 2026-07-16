import { CoachLevel } from "../../../types/nutritionist.types";

export class NutritionistPricingDTO {
  coachLevel!: CoachLevel;

  minPrice!: number;

  maxPrice!: number;
}
