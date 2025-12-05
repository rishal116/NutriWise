import { INutritionistDetails } from "../../../models/nutritionistDetails.model";
import { IUser } from "../../../models/user.model";
import { IBaseRepository } from "../IBaseRepository";


export interface INutritionistProfileRepository extends IBaseRepository<INutritionistDetails> {
  findCompleteProfile(userId: string): Promise<(INutritionistDetails & { user: IUser }) | null>;
  updateByUserId(userId: string, data: Partial<INutritionistDetails>): Promise<INutritionistDetails | null>;
}
