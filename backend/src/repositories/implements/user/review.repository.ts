import { injectable } from "inversify";
import { IReviewRepository } from "../../interfaces/user/IReviewRepository";
import { Review, IReview } from "../../../models/review.model";

@injectable()
export class ReviewRepository implements IReviewRepository {

  async create(data: Partial<IReview>): Promise<IReview> {
    return await Review.create(data);
  }

  async findByUser(
    userId: string,
    nutritionistId: string,
    planId?: string
  ): Promise<IReview | null> {
    return await Review.findOne({
      user: userId,
      nutritionist: nutritionistId,
      ...(planId && { plan: planId }),
    });
  }

  async update(
    reviewId: string,
    data: Partial<IReview>
  ): Promise<IReview | null> {
    return await Review.findByIdAndUpdate(reviewId, data, {
      new: true,
    });
  }

  async delete(reviewId: string): Promise<IReview | null> {
    return await Review.findByIdAndDelete(reviewId);
  }

  async findByNutritionist(nutritionistId: string): Promise<IReview[]> {
    return await Review.find({ nutritionist: nutritionistId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }
}