import { clientApi } from "@/lib/axios/clientApi";
import type { NutritionistApplicationDetailsDto } from "@/dtos/nutritionist/application/nutritionist-application-details.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { NUTRITIONIST_APPLICATION_ROUTES } from "@/routes/nutritionist";

export const nutritionistApplicationService = {
  async submitApplication(payload: FormData): Promise<ApiResponseDTO> {
    const { data } = await clientApi.post<ApiResponseDTO>(
      NUTRITIONIST_APPLICATION_ROUTES.SUBMIT,
      payload,
    );

    return data;
  },

  async getApplicationDetails(): Promise<NutritionistApplicationDetailsDto> {
    const { data } = await clientApi.get<
      ApiResponseDTO<NutritionistApplicationDetailsDto>
    >(NUTRITIONIST_APPLICATION_ROUTES.DETAILS);

    if (!data.data) {
      throw new Error("Nutritionist application details not found.");
    }

    return data.data;
  },

  async getApplicationStatus(): Promise<ApiResponseDTO> {
    const { data } = await clientApi.get<ApiResponseDTO>(
      NUTRITIONIST_APPLICATION_ROUTES.STATUS,
    );

    return data;
  },
};
