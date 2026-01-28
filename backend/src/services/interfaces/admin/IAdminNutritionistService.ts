import { INutritionistProfile } from "../../../models/nutritionistProfile.model";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import {
  AdminNutritionistProfileDTO,
  NutritionistStatusDTO,
} from "../../../dtos/admin/user.dto";
import { NutritionistLevel } from "../../../enums/nutritionist.enum";

export interface IAdminNutritionistService {
  getAllNutritionists(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedResponseDto<NutritionistStatusDTO>>;

  getNutritionistById(userId: string): Promise<INutritionistProfile | null>;

  approveNutritionist(userId: string): Promise<void>;

  rejectNutritionist(userId: string, reason: string): Promise<void>;

  getNutritionistProfile(
    userId: string
  ): Promise<AdminNutritionistProfileDTO>;

  updateNutritionistLevel(
    nutritionistId: string,
    level: NutritionistLevel
  ): Promise<void>;
}
