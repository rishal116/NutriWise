import { IReview } from "../../../models/review.model";
import { IReviewPopulated } from "../../../types/review.populated";

export interface IReviewRepository {
  create(data: Partial<IReview>): Promise<IReview>;

  findByUserPlan(userPlanId: string): Promise<IReview | null>;
  findByUser(
    userId: string,
    nutritionistId: string,
    planId?: string,
  ): Promise<IReview | null>;

  update(reviewId: string, data: Partial<IReview>): Promise<IReview | null>;

  softDelete(reviewId: string): Promise<IReview | null>;

  findByNutritionist(nutritionistId: string): Promise<IReviewPopulated[]>;
}
