import {
  ReviewResponseDTO,
  PublicReviewResponseDTO,
} from "../../../dtos/user/review/review-response.dto";

import { IReview } from "../../../models/review.model";
import { IReviewPopulated } from "../../../types/user/review/review.populated";

export class ReviewMapper {
  static toResponseDTO(review: IReview): ReviewResponseDTO {
    return {
      id: review._id.toString(),
      userId: review.user.toString(),
      nutritionistId: review.nutritionist.toString(),
      userPlanId: review.userPlan.toString(),
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  static toPublicResponseDTO(
    review: IReviewPopulated,
  ): PublicReviewResponseDTO {
    return {
      id: review._id.toString(),
      user: {
        id: review.user._id.toString(),
        fullName: review.user.fullName,
        profileImage: review.user.profileImage,
      },
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
    };
  }
}
