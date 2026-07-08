import { clientApi } from "@/lib/axios/clientApi";
import { ApiResponse } from "@/types/api/apiResponse";
import { NutritionistApplicationDetailsDto } from "@/dtos/nutritionist/nutritionist-application-details.dto";

export const nutritionistApplicationService = {
  submitApplication: async (data: FormData) => {
    const response = await clientApi.post(
      "/nutritionist/application/submit",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  getApplicationDetails:
    async (): Promise<NutritionistApplicationDetailsDto> => {
      const response = await clientApi.get<
        ApiResponse<NutritionistApplicationDetailsDto>
      >("/nutritionist/application/details");

      return response.data.data;
    },

  getApplicationStatus: async () => {
    const response = await clientApi.get("/nutritionist/application/status");
    return response.data;
  },
};
