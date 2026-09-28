

import { IReview } from "../../../../models/review.model";
import { IReviewPopulated } from "../../../../types/user/review/review.populated";
import { IBaseRepository } from "../../common/IBaseRepository";

export interface IReviewRatingSummary {
  averageRating: number;
  totalReviews: number;
}

export interface IReviewRepository extends IBaseRepository<IReview> {
  findByUserPlan(userPlanId: string): Promise<IReview | null>;

  findByNutritionist(
    nutritionistId: string,
  ): Promise<IReviewPopulated[]>;

  getRatingSummary(
    nutritionistId: string,
  ): Promise<IReviewRatingSummary>;
}