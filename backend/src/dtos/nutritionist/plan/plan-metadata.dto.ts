import { NutritionistPricingDTO } from "./nutritionist-pricing.dto";
import { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";

export class PlanMetadataDTO {
  pricing!: NutritionistPricingDTO;
  specializations!: Specialization[];
}
