import { injectable } from "inversify";
import { IReviewRepository } from "../../interfaces/user/IReviewRepository";
import { Review, IReview } from "../../../models/review.model";
import { IReviewPopulated } from "../../../types/review.populated";

@injectable()
export class ReviewRepository implements IReviewRepository {
  async create(data: Partial<IReview>): Promise<IReview> {
    return Review.create(data);
  }

  async findByUserPlan(userPlanId: string): Promise<IReview | null> {
    return Review.findOne({ userPlan: userPlanId });
  }

  async update(
    reviewId: string,
    data: Partial<IReview>,
  ): Promise<IReview | null> {
    return Review.findByIdAndUpdate(reviewId, data, { new: true });
  }

  async softDelete(reviewId: string): Promise<IReview | null> {
    return Review.findByIdAndUpdate(
      reviewId,
      { isDeleted: true },
      { new: true },
    );
  }

  async findByNutritionist(nutritionistId: string): Promise<IReviewPopulated[]> {
    return Review.find({
      nutritionist: nutritionistId,
      isDeleted: false,
    })
      .populate("user", "fullName profileImage")
      .sort({ createdAt: -1 })
      .lean<IReviewPopulated[]>();
  }

  async findByUser(
    userId: string,
    nutritionistId: string,
    planId?: string,
  ): Promise<IReview | null> {
    return await Review.findOne({
      user: userId,
      nutritionist: nutritionistId,
      ...(planId && { plan: planId }),
    });
  }
}
