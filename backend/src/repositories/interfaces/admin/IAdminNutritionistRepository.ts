import { CoachLevel } from "../../../types/nutritionist.types";
import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";

export interface IAdminNutritionistRepository {
  getNutritionists(query: AdminNutritionistListQueryDto): Promise<{
    nutritionists: AdminNutritionistListItemDto[];
    total: number;
  }>;

  getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto | null>;

  updateCoachLevel(userId: string, coachLevel: CoachLevel): Promise<void>;
}
