import { INutritionistDetails } from "../../../models/nutritionistDetails.model"


export interface IAdminUsersService {
  getAllClients(): Promise<any[]>;
  getAllNutritionists(): Promise<any[]>;
  blockUser(userId: string): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  getNutritionistById(userId: string): Promise<INutritionistDetails | null>;
}