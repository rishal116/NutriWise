import { NutritionistListQueryDTO } from "../../../dtos/user/nutri-browsing/nutri-list-query.dto";
import {
  NutritionistDetailResult,
  NutritionistBrowseResult,
  NutritionistBrowseStatsResult,
} from "../../../types/nutri-browsing.types";

export interface INutritionistBrowsingRepository {
  findNutritionists(
    query: NutritionistListQueryDTO,
  ): Promise<NutritionistBrowseResult>;

  findNutritionistByUsername(
    username: string,
  ): Promise<NutritionistDetailResult | null>;

  getBrowseStatistics(): Promise<NutritionistBrowseStatsResult>;
}
