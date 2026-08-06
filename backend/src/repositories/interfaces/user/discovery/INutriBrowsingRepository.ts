import { NutritionistListQueryDTO } from "../../../../dtos/user/nutri-browsing/nutri-list-query.dto";
import {
  NutritionistDetailResult,
  NutritionistBrowseStatsResult,
} from "../../../../types/nutri-browsing.types";

import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { NutritionistCardDTO } from "../../../../dtos/user/nutri-browsing/nutri-card.dto";

export interface INutritionistBrowsingRepository {
  findNutritionists(
    query: NutritionistListQueryDTO,
  ): Promise<CursorPaginationResult<NutritionistCardDTO>>;

  findNutritionistByUsername(
    username: string,
  ): Promise<NutritionistDetailResult | null>;

  getBrowseStatistics(): Promise<NutritionistBrowseStatsResult>;
}
