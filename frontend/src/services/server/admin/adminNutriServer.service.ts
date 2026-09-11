import { cookies } from "next/headers";

import { serverApi } from "@/lib/axios/serverApi";

import { ADMIN_NUTRITIONIST_ROUTES } from "@/routes/admin";

import { AdminNutritionistListQueryDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-query.dto";

import { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const adminNutritionistServerService = {
  async getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<InfiniteScrollResponseDTO<AdminNutritionistListItemDto>> {
    const cookieStore = await cookies();

    const response = await serverApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<AdminNutritionistListItemDto>>
    >(ADMIN_NUTRITIONIST_ROUTES.NUTRITIONISTS, {
      params: query,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return response.data.data;
  },
};
