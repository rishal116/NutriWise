import { CoachLevel } from "../../../types/nutritionist.types";
import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface IAdminNutritionistRepository {
  getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<CursorPaginationResult<AdminNutritionistListItemDto>>;

  getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto | null>;

  updateCoachLevel(userId: string, coachLevel: CoachLevel): Promise<void>;
}
