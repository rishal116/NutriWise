import { clientApi } from "@/lib/axios/clientApi";

import { NutritionistApplicationDetailsDto } from "@/dtos/nutritionist/application/nutritionist-application-details.dto";

import { ApiResponse } from "@/types/api/apiResponse";

import { NUTRITIONIST_APPLICATION_ROUTES } from "@/routes/nutritionist";

export const nutritionistApplicationService = {
  async submitApplication(data: FormData) {
    const response = await clientApi.post(
      NUTRITIONIST_APPLICATION_ROUTES.SUBMIT,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  async getApplicationDetails(): Promise<NutritionistApplicationDetailsDto> {
    const response = await clientApi.get<
      ApiResponse<NutritionistApplicationDetailsDto>
    >(NUTRITIONIST_APPLICATION_ROUTES.DETAILS);

    return response.data.data;
  },

  async getApplicationStatus() {
    const response = await clientApi.get(
      NUTRITIONIST_APPLICATION_ROUTES.STATUS,
    );

    return response.data;
  },
};
