import { IUser } from "../../../models/user.model";
import { WithRequiredId } from "../../../dtos/admin/user.dto";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IAdminClientRepository extends IBaseRepository<IUser>{
  getAllUsers(skip: number,limit: number,search?: string):
  Promise<{ users: WithRequiredId<Partial<IUser>>[]; total: number }>

  getAllNutritionists(skip: number,limit: number,search?: string): 
  Promise<{ nutritionists: WithRequiredId<Partial<IUser>>[]; total: number }>;

  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
}
