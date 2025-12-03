import { INutritionistDetails } from "../../../models/nutritionistDetails.model"
import { NutritionistDTO, UserDTO } from "../../../dtos/admin/user.dto";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import { NutritionistProfileDto } from "../../../dtos/nutritionist/nutritionistProfile";

export interface IAdminNutritionistService {
  getAllNutritionists(page: number, limit: number, search?:string): Promise<PaginatedResponseDto<NutritionistDTO>>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  getNutritionistById(userId: string): Promise<INutritionistDetails | null>;
  approveNutritionist(userId:string): Promise<void>;
  rejectNutritionist(userId: string, reason: string): Promise<void>;
  getNutritionistProfile(userId: string): Promise<NutritionistProfileDto>;
}