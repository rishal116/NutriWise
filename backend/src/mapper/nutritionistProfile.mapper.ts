import { NutritionistProfileDTO } from "../dtos/nutritionist/nutritionistProfile";
import { INutritionistDetails } from "../models/nutritionistDetails.model";

export const toNutritionistProfileDTO = (
  profile: INutritionistDetails & { userId: any }
): NutritionistProfileDTO => {
  const user = profile.userId || {};
  const id = typeof profile._id === "string" ? profile._id : (profile._id as any)?.toString() ?? "";

  return {
    _id: id,
    fullName: user.fullName ?? "",
    email: user.email ?? "",

    bio: profile.bio ?? "",
    qualifications: profile.qualifications ?? [],
    certifications: profile.certifications ?? [],
    experiences: profile.experiences ?? [],
    specializations: profile.specializations ?? [],
    languages: profile.languages ?? [],
    totalExperienceYears: profile.totalExperienceYears ?? 0,
    consultationDuration: profile.consultationDuration ?? "",
    videoCallRate: profile.videoCallRate ?? 0,
    availabilityStatus: profile.availabilityStatus ?? "",
    location: profile.location ?? { state: "", city: "" },
    cv: profile.cv ?? "",
  };
};
