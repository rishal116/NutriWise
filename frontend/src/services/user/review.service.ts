
import { clientApi } from "@/lib/axios/clientApi";
import { REVIEW_ROUTES } from "@/routes/user";

import type {
  CreateReviewDTO,
  PublicReviewResponseDTO,
  ReviewResponseDTO,
  UpdateReviewDTO,
} from "@/dtos/user/review/review.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const reviewService = {
  async createReview(
    nutritionistId: string,
    data: CreateReviewDTO,
  ): Promise<ReviewResponseDTO> {
    const { data: response } = await clientApi.post<
      ApiResponseDTO<ReviewResponseDTO>
    >(REVIEW_ROUTES.CREATE(nutritionistId), data);

    if (!response.data) {
      throw new Error("Failed to create review.");
    }

    return response.data;
  },

  async getMyReview(
    userPlanId: string,
  ): Promise<ReviewResponseDTO | null> {
    const { data: response } = await clientApi.get<
      ApiResponseDTO<ReviewResponseDTO | null>
    >(REVIEW_ROUTES.MY_REVIEW(userPlanId));

    if (response.data === undefined) {
      throw new Error("Failed to fetch your review.");
    }

    return response.data;
  },

  async getNutritionistReviews(
    nutritionistId: string,
  ): Promise<PublicReviewResponseDTO[]> {
    const { data: response } = await clientApi.get<
      ApiResponseDTO<PublicReviewResponseDTO[]>
    >(REVIEW_ROUTES.NUTRITIONIST_REVIEWS(nutritionistId));

    if (!response.data) {
      throw new Error("Failed to fetch nutritionist reviews.");
    }

    return response.data;
  },

  async updateReview(
    reviewId: string,
    data: UpdateReviewDTO,
  ): Promise<ReviewResponseDTO> {
    const { data: response } = await clientApi.patch<
      ApiResponseDTO<ReviewResponseDTO>
    >(REVIEW_ROUTES.UPDATE(reviewId), data);

    if (!response.data) {
      throw new Error("Failed to update review.");
    }

    return response.data;
  },

  async deleteReview(reviewId: string): Promise<void> {
    await clientApi.delete<ApiResponseDTO<null>>(
      REVIEW_ROUTES.DELETE(reviewId),
    );
  },
};
