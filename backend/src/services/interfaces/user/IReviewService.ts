import {
  SubmitReviewDTO,
  ReviewResponseDTO,
} from "../../../dtos/user/review.dto";

export interface IReviewService {
  submitReview(data: SubmitReviewDTO): Promise<ReviewResponseDTO>;

  getMyReview(
    userId: string,
    nutritionistId: string
  ): Promise<ReviewResponseDTO | null>;

  updateReview(
    reviewId: string,
    data: SubmitReviewDTO
  ): Promise<ReviewResponseDTO>;

  deleteReview(reviewId: string): Promise<void>;
}