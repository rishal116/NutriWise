import { IUser } from "../models/user.model";
import { INutritionistProfile } from "../models/nutritionistProfile.model";
export interface NutritionistDetailResult {
  user: IUser;
  profile: INutritionistProfile;
}

export interface NutritionistBrowseStatsResult {
  totalNutritionists: number;
  averageRating: number;
  totalReviews: number;
  totalPeopleCoached: number;
}
