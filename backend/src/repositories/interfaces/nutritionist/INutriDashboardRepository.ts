import type { Types } from "mongoose";

import type { INutritionistDashboardOverviewProjection } from "../../../types/nutritionist/dashboard/nutritionist-dashboard-overview.projection";

export interface INutritionistDashboardRepository {
  getOverview(
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutritionistDashboardOverviewProjection>;
}
