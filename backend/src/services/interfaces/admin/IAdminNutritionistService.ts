import { INutritionistProfile } from "../../../models/nutritionistProfile.model"
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import { AdminNutritionistProfileDTO } from "../../../dtos/admin/user.dto";
import { NutritionistStatusDTO } from "../../../dtos/admin/user.dto";

export interface IAdminNutritionistService {
  getAllNutritionists(page: number, limit: number, search?:string): Promise<PaginatedResponseDto<NutritionistStatusDTO>>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  getNutritionistById(userId: string): Promise<INutritionistProfile | null>;
  approveNutritionist(userId:string): Promise<void>;
  rejectNutritionist(userId: string, reason: string): Promise<void>;
  getNutritionistProfile(userId: string): Promise<AdminNutritionistProfileDTO>;
}