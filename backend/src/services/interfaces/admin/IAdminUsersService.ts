import { INutritionistDetails } from "../../../models/nutritionistDetails.model"
import { NutritionistDTO, UserDTO } from "../../../dtos/admin/user.dto";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";


export interface IAdminUsersService {
  getAllUsers(page: number, limit: number, search?:string): Promise<PaginatedResponseDto<UserDTO>>;
  getAllNutritionists(page: number, limit: number, search?:string): Promise<PaginatedResponseDto<NutritionistDTO>>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  getNutritionistById(userId: string): Promise<INutritionistDetails | null>;
}