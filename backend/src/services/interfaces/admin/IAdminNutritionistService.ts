import { CoachLevel } from "../../../types/nutritionist.types";
import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";

export interface IAdminNutritionistService {
  getNutritionists(query: AdminNutritionistListQueryDto): Promise<{
    data: AdminNutritionistListItemDto[];
    total: number;
    skip: number;
    limit: number;
    hasMore: boolean;
  }>;

  getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto | null>;

  updateCoachLevel(userId: string, coachLevel: CoachLevel): Promise<void>;
}
