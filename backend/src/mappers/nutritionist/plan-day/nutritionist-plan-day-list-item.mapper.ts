
import type { NutritionistPlanDayListProjection } from "../../../types/nutritionist/plan-day/nutritionist-plan-day.projection";

import type { NutritionistPlanDayListItemDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-item.dto";

export class NutritionistPlanDayListItemMapper {
  static toDTO(
    projection: NutritionistPlanDayListProjection,
  ): NutritionistPlanDayListItemDTO {
    return {
      id: projection._id.toString(),
      planId: projection.planId.toString(),
      dayNumber: projection.dayNumber,
      title: projection.title,
      description: projection.description,
      totalActivities: projection.totalActivities,
      requiredActivities: projection.requiredActivities,
      createdAt: projection.createdAt,
      updatedAt: projection.updatedAt,
    };
  }
}
