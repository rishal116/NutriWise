import { CreateReviewDTO } from "../../../../dtos/user/review/create-review.dto";
import { UpdateReviewDTO } from "../../../../dtos/user/review/update-review.dto";
import {
  ReviewResponseDTO,
  PublicReviewResponseDTO,
} from "../../../../dtos/user/review/review-response.dto";

export interface IReviewService {
  createReview(
    userId: string,
    nutritionistId: string,
    dto: CreateReviewDTO,
  ): Promise<ReviewResponseDTO>;

  getMyReview(
    userId: string,
    userPlanId: string,
  ): Promise<ReviewResponseDTO | null>;

  getNutritionistReviews(
    nutritionistId: string,
  ): Promise<PublicReviewResponseDTO[]>;

  updateReview(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDTO,
  ): Promise<ReviewResponseDTO>;

  deleteReview(userId: string, reviewId: string): Promise<void>;
}
