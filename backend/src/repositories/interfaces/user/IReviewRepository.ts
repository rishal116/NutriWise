import { IReview } from "../../../models/review.model";

export interface IReviewRepository {
  create(data: Partial<IReview>): Promise<IReview>;

  findByUser(
    userId: string,
    nutritionistId: string,
    planId?: string
  ): Promise<IReview | null>;

  update(
    reviewId: string,
    data: Partial<IReview>
  ): Promise<IReview | null>;

  delete(reviewId: string): Promise<IReview | null>;

  findByNutritionist(nutritionistId: string): Promise<IReview[]>;
}