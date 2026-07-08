import { cookies } from "next/headers";
import { serverApi } from "@/lib/axios/serverApi";
import { AdminRoutes } from "@/routes/admin.routes";

import { InfiniteScrollResponseDto } from "@/dtos/common/infinite-scroll-response.dto";
import { AdminNutritionistApplicationListQueryDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";
import { AdminNutritionistApplicationListItemDto } from "@/dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

export const adminNutritionistApplicationServerService = {
  async getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<
    InfiniteScrollResponseDto<AdminNutritionistApplicationListItemDto>
  > {
    const cookieStore = await cookies();
    const response = await serverApi.get<
      InfiniteScrollResponseDto<AdminNutritionistApplicationListItemDto>
    >(AdminRoutes.NUTRITIONIST_APPLICATIONS, {
      params: query,
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return response.data;
  },
};
