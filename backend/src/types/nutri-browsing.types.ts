import { IUser } from "../models/user.model";
import { INutritionistProfile } from "../models/nutritionistProfile.model";
import { NutritionistCardDTO } from "../dtos/user/nutri-browsing/nutri-card.dto";

export interface NutritionistDetailResult {
  user: IUser;
  profile: INutritionistProfile;
}

export interface NutritionistBrowseResult {
  items: NutritionistCardDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface NutritionistBrowseStatsResult {
  totalNutritionists: number;
  averageRating: number;
  totalReviews: number;
  totalPeopleCoached: number;
}