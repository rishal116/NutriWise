import { INutritionistProfile } from "../../models/nutritionistProfile.model";
import { NutritionistDetailsDto } from "../../dtos/nutritionist/nutritionistApplication.dto";

export class NutritionistApplicationMapper {
  static toDetailsDto(
    nutritionist: INutritionistProfile,
  ): NutritionistDetailsDto {
    return {
      qualifications: nutritionist.qualifications,
      specializations: nutritionist.specializations,
      experiences: nutritionist.experiences,
      bio: nutritionist.bio,
      languages: nutritionist.languages,
      availabilityStatus: nutritionist.availabilityStatus,
      resumeUrl: nutritionist.resumeUrl,
      certifications: nutritionist.certifications,
      totalExperienceYears: nutritionist.totalExperienceYears,
      applicationStatus: nutritionist.applicationStatus,
      rejectionReason: nutritionist.rejectionReason,
      coachLevel: nutritionist.coachLevel,
      rating: nutritionist.rating,
      totalReviews: nutritionist.totalReviews,
      totalPeopleCoached: nutritionist.totalPeopleCoached,
    };
  }
}