
import type { AdminNutritionistApplicationListItemDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

import type { IAdminNutritionistApplicationListProjection } from "../../../types/admin/nutri-application/admin-nutritionist-application-list.projection";

export class AdminNutritionistApplicationMapper {
  static toListItemDto(
    projection: IAdminNutritionistApplicationListProjection,
  ): AdminNutritionistApplicationListItemDto {
    return {
      id: projection._id.toString(),
      userId: projection.userId.toString(),
      fullName: projection.fullName,
      email: projection.email,
      ...(projection.profileImage
        ? { profileImage: projection.profileImage }
        : {}),
      applicationStatus: projection.applicationStatus,
      createdAt: projection.createdAt,
    };
  }

  static toListItemDtos(
    projections: IAdminNutritionistApplicationListProjection[],
  ): AdminNutritionistApplicationListItemDto[] {
    return projections.map((projection) =>
      this.toListItemDto(projection),
    );
  }
}
