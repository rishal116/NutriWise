import { NutritionistPricingDTO } from "./nutritionist-pricing.dto";
import { Specialization } from "../../../types/nutritionist.types";

export class PlanMetadataDTO {
  pricing!: NutritionistPricingDTO;

  specializations!: Specialization[];
}