
import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_CREDENTIALS_ROUTES } from "@/routes/nutritionist/credentials.routes";

import type { NutritionistCredentialsDTO } from "@/dtos/nutritionist/credentials/nutritionist-credentials.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const nutritionistCredentialsService = {
  async getCredentials(): Promise<NutritionistCredentialsDTO> {
    const { data } = await clientApi.get<
      ApiResponseDTO<NutritionistCredentialsDTO>
    >(NUTRITIONIST_CREDENTIALS_ROUTES.GET_CREDENTIALS);

    if (!data.data) {
      throw new Error("Nutritionist credentials not found.");
    }

    return data.data;
  },
};
