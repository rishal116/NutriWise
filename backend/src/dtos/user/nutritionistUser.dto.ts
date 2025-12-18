import { IUser } from "../../models/user.model";
import { INutritionistProfile } from "../../models/nutritionistProfile.model";

export interface NutritionistUserDto {
  id: string;
  fullName: string;
  specializations: string[];
  rating: number;
  country?: string;
  bio?: string;
  totalExperienceYears?: number;
  profileImage?: string;
}

export class NutritionistUserDTO implements NutritionistUserDto {
  id: string;
  fullName: string;
  specializations: string[];
  rating: number;
  country?: string;
  bio?: string;
  totalExperienceYears?: number;
  profileImage?: string;

  constructor(user: IUser, profile?: INutritionistProfile) {
    this.id = user._id.toString();
    this.fullName = user.fullName ?? "";
    this.specializations = profile?.specializations ?? [];
    this.rating = profile?.rating ?? 0;
    this.bio = profile?.bio ?? "";
    this.totalExperienceYears = profile?.totalExperienceYears ?? 0;
    this.profileImage = profile?.profileImage ?? "";
    if (profile?.country) {
      this.country = profile.country;
    }
  }
}


export interface NutritionistFilterDTO {
  search?: string;
  specializations?: string[];
  languages?: string[];
  country?: string[];
  availabilityStatus?: string[];
  minExperience?: number;
  minRating?: number;
}