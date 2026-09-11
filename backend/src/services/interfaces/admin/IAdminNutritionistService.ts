import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";

import { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";

import { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";

import { CoachLevel } from "../../../types/nutritionist.types";

export interface IAdminNutritionistService {
  getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<InfiniteScrollResponseDTO<AdminNutritionistListItemDto>>;

  getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto | null>;

  updateCoachLevel(userId: string, coachLevel: CoachLevel): Promise<void>;
}
