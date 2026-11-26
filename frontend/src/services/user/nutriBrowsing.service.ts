
import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_BROWSING_ROUTES } from "@/routes/user";

import type { NutritionistListQueryDTO } from "@/dtos/user/nutri-browsing/nutri-list-query.dto";
import type { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";
import type { NutritionistStatsDTO } from "@/dtos/user/nutri-browsing/nutri-stats.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { NutritionistCardDTO } from "@/dtos/user/nutri-browsing/nutri-card.dto";

export const nutritionistBrowsingService = {
  async browseNutritionists(
    query: NutritionistListQueryDTO,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<NutritionistCardDTO>>> {
    const params: Record<string, string | number | boolean> = {};

    if (query.search) params.search = query.search;
    if (query.specialization) params.specialization = query.specialization;

    if (query.languages?.length) {
      params.languages = query.languages.join(",");
    }

    if (query.coachLevel) params.coachLevel = query.coachLevel;
    if (query.gender) params.gender = query.gender;
    if (query.minRating !== undefined) params.minRating = query.minRating;

    if (query.availableOnly !== undefined) {
      params.availableOnly = query.availableOnly;
    }

    if (query.sortBy) params.sortBy = query.sortBy;
    if (query.cursor) params.cursor = query.cursor;
    if (query.limit) params.limit = query.limit;

    const { data } = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<NutritionistCardDTO>>
    >(NUTRITIONIST_BROWSING_ROUTES.LIST, { params });

    return data;
  },

  async getNutritionistProfile(
    username: string,
  ): Promise<NutritionistDetailDTO> {
    const { data } = await clientApi.get<
      ApiResponseDTO<NutritionistDetailDTO>
    >(NUTRITIONIST_BROWSING_ROUTES.DETAILS(username));

    if (!data.data) {
      throw new Error("Nutritionist profile not found.");
    }

    return data.data;
  },

  async getNutritionistStats(): Promise<NutritionistStatsDTO> {
    const { data } = await clientApi.get<
      ApiResponseDTO<NutritionistStatsDTO>
    >(NUTRITIONIST_BROWSING_ROUTES.STATS);

    if (!data.data) {
      throw new Error("Nutritionist statistics not found.");
    }

    return data.data;
  },
};
