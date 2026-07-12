import { cookies } from "next/headers";
import { serverApi } from "@/lib/axios/serverApi";
import { AdminRoutes } from "@/routes/admin.routes";

import { AdminNutritionistListQueryDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import { AdminNutritionistListItemDto } from "@/dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";

export const adminNutritionistServerService = {
  async getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<InfiniteScrollResponseDto<AdminNutritionistListItemDto>> {
    const cookieStore = await cookies();

    const response = await serverApi.get<
      InfiniteScrollResponseDto<AdminNutritionistListItemDto>
    >(AdminRoutes.NUTRITIONISTS, {
      params: query,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return response.data;
  },
};
