import { clientApi } from "@/lib/axios/clientApi";
import { ADMIN_NUTRITIONIST_ROUTES } from "@/routes/admin";

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
    >(ADMIN_NUTRITIONIST_ROUTES.NUTRITIONISTS, {
      params: query,
    });

    return response.data;
  },

  async getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto> {
    const response = await clientApi.get<
      ApiResponse<AdminNutritionistDetailsDto>
    >(ADMIN_NUTRITIONIST_ROUTES.DETAILS(userId));

    return response.data.data;
  },

  async updateCoachLevel(
    userId: string,
    coachLevel: NutritionistLevel,
  ): Promise<void> {
    await clientApi.patch(
      ADMIN_NUTRITIONIST_ROUTES.COACH_LEVEL(userId),
      {
        coachLevel,
      },
    );
  },
};