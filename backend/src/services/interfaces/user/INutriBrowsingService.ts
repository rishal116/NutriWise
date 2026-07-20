import { NutritionistCardDTO } from "../../../dtos/user/nutri-browsing/nutri-card.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { NutritionistListQueryDTO } from "../../../dtos/user/nutri-browsing/nutri-list-query.dto";
import { NutritionistDetailDTO } from "../../../dtos/user/nutri-browsing/nutri-profile.dto";
import { NutritionistBrowseStatsDTO } from "../../../dtos/user/nutri-browsing/nutri-browse-stats.dto";

export interface INutritionistBrowsingService {
  browseNutritionists(
    query: NutritionistListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutritionistCardDTO>>;

  getNutritionistProfile(username: string): Promise<NutritionistDetailDTO>;
  getBrowseStatistics(): Promise<NutritionistBrowseStatsDTO>;
}
