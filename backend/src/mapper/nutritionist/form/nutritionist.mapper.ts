import { INutritionistProfile } from "../../../models/nutritionistProfile.model";
import { NutritionistApplicationDetailsDto } from "../../../dtos/nutritionist/form/nutritionist-details.dto";
import { NutritionistApplicationStatusDto } from "../../../dtos/nutritionist/form/nutritionist-status.dto";

export class NutritionistMapper {
  static toApplicationDetailsDto(
    nutritionist: INutritionistProfile,
  ): NutritionistApplicationDetailsDto {
    return {
      qualifications: nutritionist.qualifications.map((qualification) => ({
        degree: qualification.degree,
        institution: qualification.institution,
        year: qualification.year,
      })),
      specializations: [...nutritionist.specializations],
      experiences: nutritionist.experiences.map((experience) => ({
        role: experience.role,
        organization: experience.organization,
        durationYears: experience.durationYears,
      })),
      bio: nutritionist.bio,
      languages: [...nutritionist.languages],
      resumeUrl: nutritionist.resumeUrl,
      certifications: nutritionist.certifications.map((certification) => ({
        name: certification.name,
        issuedBy: certification.issuedBy,
        certificateUrl: certification.certificateUrl,
      })),
    };
  }

  static toApplicationStatusDto(
    nutritionist: INutritionistProfile,
  ): NutritionistApplicationStatusDto {
    return {
      applicationStatus: nutritionist.applicationStatus,
      rejectionReason: nutritionist.rejectionReason,
    };
  }
}
