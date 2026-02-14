import { IUser } from "../../../models/user.model";
import { INutritionistProfile } from "../../../models/nutritionistProfile.model";
import { NutritionistListFilter, NutritionistRepoResult } from "../../../dtos/user/nutritionistUser.dto";

export interface IUserNutritionistProfileRepository {
  findAllNutritionist(filters: NutritionistListFilter): Promise<NutritionistRepoResult>;
  findByUserId(userId: string): Promise<{ user: IUser; profile: INutritionistProfile } | null>;
}
