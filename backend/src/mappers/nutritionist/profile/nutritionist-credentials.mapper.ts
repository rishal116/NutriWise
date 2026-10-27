import type { IUser } from "../../../models/user.model";
import type { INutritionistProfile } from "../../../models/nutritionistProfile.model";
import type { NutritionistCredentialsDTO } from "../../../dtos/nutritionist/profile/nutritionist-credentials.dto";

export class NutritionistCredentialsMapper {
  static toDTO(
    user: IUser,
    profile: INutritionistProfile,
  ): NutritionistCredentialsDTO {
    return {
      fullName: user.fullName,
      username: user.username,
      profileImage: user.profileImage ?? null,

      qualifications: profile.qualifications.map((qualification) => ({
        degree: qualification.degree,
        institution: qualification.institution,
        year: qualification.year,
      })),

      specializations: [...profile.specializations],

      experiences: profile.experiences.map((experience) => ({
        role: experience.role,
        organization: experience.organization,
        durationYears: experience.durationYears,
      })),

      bio: profile.bio ?? null,
      languages: [...profile.languages],

      certifications: profile.certifications.map((certification) => ({
        name: certification.name,
        issuedBy: certification.issuedBy,
        certificateUrl: certification.certificateUrl,
      })),

      totalExperienceYears: profile.experiences.reduce(
        (total, experience) => total + experience.durationYears,
        0,
      ),

      coachLevel: profile.coachLevel,
      rating: profile.rating,
      totalReviews: profile.totalReviews,
      totalPeopleCoached: profile.totalPeopleCoached,
    };
  }
}
