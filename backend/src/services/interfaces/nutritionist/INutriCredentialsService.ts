import type { NutritionistCredentialsDTO } from "../../../dtos/nutritionist/profile/nutritionist-credentials.dto";

export interface INutritionistCredentialsService {
  getCredentials(userId: string): Promise<NutritionistCredentialsDTO>;
}
