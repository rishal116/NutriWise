import { NutritionistApplicationDetailsDto } from "../../../dtos/nutritionist/form/nutritionist-details.dto";
import { SubmitNutritionistApplicationDto } from "../../../dtos/nutritionist/form/nutritionist-form.dto";
import { NutritionistApplicationStatusDto } from "../../../dtos/nutritionist/form/nutritionist-status.dto";

export interface INutritionistApplicationService {
  getApplicationDetails(
    userId: string,
  ): Promise<NutritionistApplicationDetailsDto>;

  submitApplication(dto: SubmitNutritionistApplicationDto): Promise<void>;

  getApplicationStatus(
    userId: string,
  ): Promise<NutritionistApplicationStatusDto>;
}
