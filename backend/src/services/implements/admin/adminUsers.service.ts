import { injectable, inject } from "inversify";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IAdminUsersService } from "../../interfaces/admin/IAdminUsersService";
import { TYPES } from "../../../types/types";
import { INutritionistDetailsRepository } from "../../../repositories/interfaces/nutritionist/INutritionistDetailsRepository";
import { UserDTO } from "../../../dtos/admin/user.dto";
import { PaginatedResponseDto } from "../../../dtos/base/BaseResponse.dtos";
import { NutritionistDTO } from "../../../dtos/admin/user.dto";



@injectable()
export class AdminUsersService implements IAdminUsersService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.INutritionistDetailsRepository) private _nutritionistDetailsRepo : INutritionistDetailsRepository,
  ) {}
  
  async getAllUsers( page: number = 1, limit: number = 10, search?: string ): Promise<PaginatedResponseDto<UserDTO>> {
    const skip = (page - 1) * limit;
    const { users, total } = await this._userRepository.getAllUsers(skip, limit, search);
    const userDTOs: UserDTO[] = users.map(u => ({
      id: u._id as string,
      name: u.fullName || "",
      email: u.email || "",
      role: u.role!,
      isBlocked: u.isBlocked ?? false,
    }));
    return new PaginatedResponseDto<UserDTO>(userDTOs, total, page, limit);
  }
  
  async getAllNutritionists(page: number, limit: number, search?: string): Promise<PaginatedResponseDto<NutritionistDTO>> {
    const skip = (page - 1) * limit;
    const { nutritionists, total } = await this._userRepository.getAllNutritionists(skip, limit, search);
    const nutritionistDTOs: NutritionistDTO[] = nutritionists.map(n => ({
      id: n._id as string,
      name: n.fullName || "",
      email: n.email || "",
      role: n.role!,
      isBlocked: n.isBlocked ?? false,
      nutritionistStatus: n.nutritionistStatus || "none",
    }));
    return new PaginatedResponseDto<NutritionistDTO>(nutritionistDTOs, total, page, limit);
  }

  async blockUser(userId: string): Promise<void> {
    return this._userRepository.blockUser(userId);
  }

  async unblockUser(userId: string): Promise<void> {
    return this._userRepository.unblockUser(userId);
  }
  
  async getNutritionistById(userId: string) {
    const nutritionist = await this._nutritionistDetailsRepo.findByUserId(userId)
    return nutritionist;
  }

}
