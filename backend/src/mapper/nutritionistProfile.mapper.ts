import { NutritionistGeneralInfoDTO } from "../dtos/nutritionist/nutritionistProfile";
import { INutritionistProfile } from "../models/nutritionistProfile.model";

export const toNutritionistGeneralInfoDTO = (
  profile: INutritionistProfile & {
    userId: {
      fullName?: string;
      phone?: string;
      gender?: string;
    };
  }
): NutritionistGeneralInfoDTO => {
  return {
    _id: profile._id.toString(),

    fullName: profile.userId?.fullName ?? "",
    phone: profile.userId?.phone ?? "",
    gender: profile.userId?.gender ?? "",

    country: profile.country ?? "",
    languages: profile.languages ?? [],
    bio: profile.bio ?? "",
  };
};
