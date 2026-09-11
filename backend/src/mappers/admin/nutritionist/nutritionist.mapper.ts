import { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";

export class NutritionistMapper {
  static toAdminNutritionistListItemDto(
    nutritionist: AdminNutritionistListItemDto,
  ): AdminNutritionistListItemDto {
    return {
      ...nutritionist,
    };
  }

  static toAdminNutritionistListItemDtos(
    nutritionists: AdminNutritionistListItemDto[],
  ): AdminNutritionistListItemDto[] {
    return nutritionists.map(this.toAdminNutritionistListItemDto);
  }

  static toAdminNutritionistDetailsDto(
    nutritionist: AdminNutritionistDetailsDto,
  ): AdminNutritionistDetailsDto {
    return {
      ...nutritionist,
    };
  }
}
