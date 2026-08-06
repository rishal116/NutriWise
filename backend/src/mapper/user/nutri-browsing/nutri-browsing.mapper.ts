import { NutritionistCardDTO } from "../../../dtos/user/nutri-browsing/nutri-card.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export function toNutritionistBrowseResponseDTO(
  result: CursorPaginationResult<NutritionistCardDTO>,
): InfiniteScrollResponseDTO<NutritionistCardDTO> {
  const items = result.items.map((item) => ({
    id: item.id,
    username:item.username,
    fullName: item.fullName,
    profileImage: item.profileImage,
    specializations: item.specializations,
    coachLevel: item.coachLevel,
    rating: item.rating,
    totalReviews: item.totalReviews,
    totalExperienceYears: item.totalExperienceYears,
  }));

  return new InfiniteScrollResponseDTO(
    items,
    result.nextCursor,
    result.hasMore,
  );
}
import { NutritionistDetailDTO } from "../../../dtos/user/nutri-browsing/nutri-profile.dto";
import { NutritionistDetailResult } from "../../../types/nutri-browsing.types";

export const toNutritionistDetailDTO = (
  nutritionist: NutritionistDetailResult,
): NutritionistDetailDTO => ({
  user: {
    username: nutritionist.user.username,
    fullName: nutritionist.user.fullName,
    profileImage: nutritionist.user.profileImage,
  },

  profile: {
    bio: nutritionist.profile.bio,

    specializations: nutritionist.profile.specializations,

    languages: nutritionist.profile.languages,

    qualifications: nutritionist.profile.qualifications,

    experiences: nutritionist.profile.experiences,

    certifications: nutritionist.profile.certifications,

    coachLevel: nutritionist.profile.coachLevel,

    availabilityStatus: nutritionist.profile.availabilityStatus,

    totalExperienceYears: nutritionist.profile.totalExperienceYears,

    rating: nutritionist.profile.rating,

    totalReviews: nutritionist.profile.totalReviews,

    totalPeopleCoached: nutritionist.profile.totalPeopleCoached,
  },
});

import { NutritionistBrowseStatsDTO } from "../../../dtos/user/nutri-browsing/nutri-browse-stats.dto";
import { NutritionistBrowseStatsResult } from "../../../types/nutri-browsing.types";

export const toNutritionistBrowseStatsDTO = (
  result: NutritionistBrowseStatsResult,
): NutritionistBrowseStatsDTO => ({
  totalNutritionists: result.totalNutritionists,
  averageRating: result.averageRating,
  totalReviews: result.totalReviews,
  totalPeopleCoached: result.totalPeopleCoached,
});
