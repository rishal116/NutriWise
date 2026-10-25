import { clientApi } from "@/lib/axios/clientApi";
import { ADMIN_NUTRITIONIST_ROUTES } from "@/routes/admin";

import type { NutritionistLevel } from "@/enums/admin/nutritionist.enum";
import type { AdminNutritionistListQueryDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import type { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import type { AdminNutritionistDetailsDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminNutritionistService = {
  async getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<InfiniteScrollResponseDTO<AdminNutritionistListItemDto>> {
    const response = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminNutritionistListItemDto>>
    >(ADMIN_NUTRITIONIST_ROUTES.NUTRITIONISTS, {
      params: query,
    });

    if (!response.data.data) {
      throw new Error("Nutritionists response data is missing.");
    }

    return response.data.data;
  },

  async getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto> {
    const response = await clientApi.get<
      ApiResponseDTO<AdminNutritionistDetailsDto>
    >(ADMIN_NUTRITIONIST_ROUTES.DETAILS(userId));

    if (!response.data.data) {
      throw new Error("Nutritionist details response data is missing.");
    }

    return response.data.data;
  },

  async updateCoachLevel(
    userId: string,
    coachLevel: NutritionistLevel,
  ): Promise<void> {
    await clientApi.patch(ADMIN_NUTRITIONIST_ROUTES.COACH_LEVEL(userId), {
      coachLevel,
    });
  },
};
