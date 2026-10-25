import type { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";
import type { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";
import type { IAdminNutritionistListProjection } from "../../../types/admin/nutritionist/admin-nutri-list.projection";
import type { IAdminNutritionistDetailsProjection } from "../../../types/admin/nutritionist/admin-nutritionist-details.projection";

export class NutritionistMapper {
  static toAdminNutritionistListItemDto(
    nutritionist: IAdminNutritionistListProjection,
  ): AdminNutritionistListItemDto {
    return {
      id: nutritionist._id.toString(),
      userId: nutritionist.userId.toString(),
      fullName: nutritionist.fullName,
      email: nutritionist.email,
      username: nutritionist.username,
      profileImage: nutritionist.profileImage,
      coachLevel: nutritionist.coachLevel,
      rating: nutritionist.rating,
      totalReviews: nutritionist.totalReviews,
      isBlocked: nutritionist.isBlocked,
      createdAt: nutritionist.createdAt,
    };
  }

  static toAdminNutritionistListItemDtos(
    nutritionists: IAdminNutritionistListProjection[],
  ): AdminNutritionistListItemDto[] {
    return nutritionists.map((nutritionist) =>
      this.toAdminNutritionistListItemDto(nutritionist),
    );
  }

  static toAdminNutritionistDetailsDto(
    nutritionist: IAdminNutritionistDetailsProjection,
  ): AdminNutritionistDetailsDto {
    return {
      id: nutritionist._id.toString(),
      userId: nutritionist.userId.toString(),
      fullName: nutritionist.fullName,
      email: nutritionist.email,
      username: nutritionist.username,
      profileImage: nutritionist.profileImage,
      gender: nutritionist.gender,
      roles: nutritionist.roles,
      activeRole: nutritionist.activeRole,
      isBlocked: nutritionist.isBlocked,
      isProfileCompleted: nutritionist.isProfileCompleted,
      qualifications: nutritionist.qualifications,
      experiences: nutritionist.experiences,
      certifications: nutritionist.certifications,
      specializations: nutritionist.specializations,
      languages: nutritionist.languages,
      bio: nutritionist.bio,
      resumeUrl: nutritionist.resumeUrl,
      availabilityStatus: nutritionist.availabilityStatus,
      applicationStatus: nutritionist.applicationStatus,
      rejectionReason: nutritionist.rejectionReason,
      coachLevel: nutritionist.coachLevel,
      rating: nutritionist.rating,
      totalReviews: nutritionist.totalReviews,
      totalPeopleCoached: nutritionist.totalPeopleCoached,
      totalExperienceYears: nutritionist.totalExperienceYears,
      createdAt: nutritionist.createdAt,
      updatedAt: nutritionist.updatedAt,
    };
  }
}
