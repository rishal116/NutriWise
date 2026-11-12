
import type { NutritionistPlanDayDetailsProjection } from "../../../types/nutritionist/plan-day/nutritionist-plan-day.projection";

import type {
  NutritionistPlanActivityDetailsDTO,
  NutritionistPlanDayDetailsDTO,
} from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-details.dto";

export class NutritionistPlanDayDetailsMapper {
  static toDTO(
    projection: NutritionistPlanDayDetailsProjection,
  ): NutritionistPlanDayDetailsDTO {
    return {
      id: projection._id.toString(),
      planId: projection.planId.toString(),
      dayNumber: projection.dayNumber,
      title: projection.title,
      description: projection.description,
      activities: projection.activities.map(
        (activity): NutritionistPlanActivityDetailsDTO => ({
          id: activity._id.toString(),
          category: activity.category,
          title: activity.title,
          description: activity.description,
          instructions: activity.instructions,
          valueType: activity.valueType,
          targetValue: activity.targetValue,
          unit: activity.unit,
          estimatedDurationMinutes: activity.estimatedDurationMinutes,
          scheduledTime: activity.scheduledTime,
          isRequired: activity.isRequired,
          order: activity.order,
        }),
      ),
      createdAt: projection.createdAt,
      updatedAt: projection.updatedAt,
    };
  }
}
