import { injectable, inject } from "inversify";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IAdminUsersService } from "../../interfaces/admin/IAdminUsersService";
import { TYPES } from "../../../types/types";
import { INutritionistDetailsRepository } from "../../../repositories/interfaces/nutritionist/INutritionistDetailsRepository";



@injectable()
export class AdminUsersService implements IAdminUsersService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.INutritionistDetailsRepository) private _nutritionistDetailsRepo : INutritionistDetailsRepository,
  ) {}


  async getAllClients(): Promise<any[]> {
    return this._userRepository.getAllClients();
  }

  async getAllNutritionists(): Promise<any[]> {
    return this._userRepository.getAllNutritionists();
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
