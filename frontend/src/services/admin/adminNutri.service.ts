import { clientApi } from "@/lib/axios/clientApi";
import { AdminRoutes } from "@/routes/admin.routes";

import { NutritionistLevel } from "@/enums/admin/nutritionist.enum";
import { AdminNutritionistListQueryDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { AdminNutritionistDetailsDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";
import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";
import { ApiResponse } from "@/types/api/apiResponse";

export const adminNutritionistService = {
  async getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<InfiniteScrollResponseDto<AdminNutritionistListItemDto>> {
    const response = await clientApi.get<
      InfiniteScrollResponseDto<AdminNutritionistListItemDto>
    >(AdminRoutes.NUTRITIONISTS, {
      params: query,
    });

    return response.data;
  },

  async getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto> {
    const response = await clientApi.get<
      ApiResponse<AdminNutritionistDetailsDto>
    >(`${AdminRoutes.NUTRITIONISTS}/${userId}`);

    return response.data.data;
  },

  async updateCoachLevel(
    userId: string,
    coachLevel: NutritionistLevel,
  ): Promise<void> {
    await clientApi.patch(
      `${AdminRoutes.NUTRITIONISTS}/${userId}/coach-level`,
      {
        coachLevel,
      },
    );
  },
};
