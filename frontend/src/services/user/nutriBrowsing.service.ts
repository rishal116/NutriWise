import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_BROWSING_ROUTES } from "@/routes/user";
import { NutritionistListQueryDTO } from "@/dtos/user/nutri-browsing/nutri-list-query.dto";
import { NutritionistCardDTO } from "@/dtos/user/nutri-browsing/nutri-card.dto";
import { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";
import { NutritionistStatsDTO } from "@/dtos/user/nutri-browsing/nutri-stats.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

export const nutritionistBrowsingService = {
  async browseNutritionists(
    query: NutritionistListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutritionistCardDTO>> {
    const { data } = await clientApi.get(NUTRITIONIST_BROWSING_ROUTES.LIST, {
      params: query,
    });

    return data.data;
  },

  async getNutritionistProfile(
    username: string,
  ): Promise<NutritionistDetailDTO> {
    const { data } = await clientApi.get(
      NUTRITIONIST_BROWSING_ROUTES.DETAILS(username),
    );

    return data.data;
  },

  async getNutritionistStats(): Promise<NutritionistStatsDTO> {
    const { data } = await clientApi.get(NUTRITIONIST_BROWSING_ROUTES.STATS);

    return data.data;
  },
};
