import { clientApi } from "@/lib/axios/clientApi";
import { NUTRITIONIST_BROWSING_ROUTES } from "@/routes/user";
import { NutritionistListQueryDTO } from "@/dtos/user/nutri-browsing/nutri-list-query.dto";
import { NutritionistDetailDTO } from "@/dtos/user/nutri-browsing/nutri-detail.dto";
import { NutritionistStatsDTO } from "@/dtos/user/nutri-browsing/nutri-stats.dto";
import { NutritionistBrowseResponseDTO } from "@/dtos/user/nutri-browsing/nutritionist-browse-response.dto";

export const nutritionistBrowsingService = {
  async browseNutritionists(
    query: NutritionistListQueryDTO,
  ): Promise<NutritionistBrowseResponseDTO> {
    const params: Record<string, string | number | boolean> = {};

    if (query.search) params.search = query.search;
    if (query.specialization) params.specialization = query.specialization;
    if (query.languages && query.languages.length > 0) {
      params.languages = query.languages.join(",");
    }
    if (query.coachLevel) params.coachLevel = query.coachLevel;
    if (query.gender) params.gender = query.gender;
    if (query.minRating !== undefined) params.minRating = query.minRating;
    if (query.availableOnly !== undefined) params.availableOnly = query.availableOnly;
    if (query.sortBy) params.sortBy = query.sortBy;
    if (query.cursor) params.cursor = query.cursor;
    if (query.limit) params.limit = query.limit;

    const { data } = await clientApi.get(NUTRITIONIST_BROWSING_ROUTES.LIST, {
      params,
    });

    return data;
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
