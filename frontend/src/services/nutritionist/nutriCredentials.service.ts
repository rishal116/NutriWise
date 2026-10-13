import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_CREDENTIALS_ROUTES } from "@/routes/nutritionist/credentials.routes";
import type { NutritionistCredentialsDTO } from "@/dtos/nutritionist/credentials/nutritionist-credentials.dto";
import type { ApiResponse } from "@/types/api/apiResponse";

export const nutritionistCredentialsService = {
  async getCredentials(): Promise<NutritionistCredentialsDTO> {
    const res = await clientApi.get<ApiResponse<NutritionistCredentialsDTO>>(
      NUTRITIONIST_CREDENTIALS_ROUTES.GET_CREDENTIALS,
    );

    return res.data.data;
  },
};
