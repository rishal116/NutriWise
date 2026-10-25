import type { CoachLevel } from "../../../types/nutritionist.types";
import type { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import type { IAdminNutritionistListProjection } from "../../../types/admin/nutritionist/admin-nutri-list.projection";
import type { IAdminNutritionistDetailsProjection } from "../../../types/admin/nutritionist/admin-nutritionist-details.projection";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface IAdminNutritionistRepository {
  getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<CursorPaginationResult<IAdminNutritionistListProjection>>;

  getNutritionistDetails(
    userId: string,
  ): Promise<IAdminNutritionistDetailsProjection | null>;

  updateCoachLevel(userId: string, coachLevel: CoachLevel): Promise<void>;
}
