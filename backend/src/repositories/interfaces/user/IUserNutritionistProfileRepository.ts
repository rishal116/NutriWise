import { IUser } from "../../../models/user.model";
import { INutritionistProfile } from "../../../models/nutritionistProfile.model";

export interface IUserNutritionistProfileRepository {
  findAllNutritionist(): Promise<
    { user: IUser; profile: INutritionistProfile }[]
  >;

  findByUserId(
    userId: string
  ): Promise<{ user: IUser; profile: INutritionistProfile } | null>;
}
