import type { INutritionistPlanDay } from "../../../models/nutritionistPlanDay.model";
import type { CreateUserProgramDayDTO } from "../../../models/userProgramDay.model";
import type { Types } from "mongoose";

export class StripeProgramDayMapper {
  static toUserProgramDays(
    templateDays: INutritionistPlanDay[],
    userProgramId: Types.ObjectId,
  ): CreateUserProgramDayDTO[] {
    return [...templateDays]
      .sort((first, second) => first.dayNumber - second.dayNumber)
      .map((day) => ({
        userProgramId,
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,
        activities: day.activities.map((activity) => ({
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
        })),
      }));
  }
}
