import { Types } from "mongoose";
import { injectable } from "inversify";

import { IReview } from "../../../../models/review.model";
import { Review } from "../../../../models/review.model";
import { IReviewPopulated } from "../../../../types/user/review/review.populated";

import { BaseRepository } from "../../common/base.repository";

import {
  IReviewRepository,
  IReviewRatingSummary,
} from "../../../interfaces/user/discovery/IReviewRepository";

@injectable()
export class ReviewRepository
  extends BaseRepository<IReview>
  implements IReviewRepository {
  constructor() {
    super(Review);
  }

  async findByUserPlan(
    userPlanId: string,
  ): Promise<IReview | null> {
    return this._model
      .findOne({
        userPlan: new Types.ObjectId(userPlanId),
      })
      .lean<IReview | null>()
      .exec();
  }

  async findByNutritionist(
    nutritionistId: string,
  ): Promise<IReviewPopulated[]> {
    return this._model
      .find({
        nutritionist: new Types.ObjectId(nutritionistId),
      })
      .select(
        "user nutritionist userPlan rating review createdAt updatedAt",
      )
      .populate("user", "fullName profileImage")
      .sort({ createdAt: -1 })
      .lean<IReviewPopulated[]>()
      .exec();
  }

  getRatingSummary(
    nutritionistId: string,
  ): Promise<IReviewRatingSummary>;

  async getRatingSummary(
    nutritionistId: string,
  ): Promise<IReviewRatingSummary> {
    const result = await this._model.aggregate<IReviewRatingSummary>([
      {
        $match: {
          nutritionist: new Types.ObjectId(nutritionistId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          averageRating: 1,
          totalReviews: 1,
        },
      },
    ]);

    if (!result.length) {
      return {
        averageRating: 0,
        totalReviews: 0,
      };
    }

    return {
      averageRating:
        Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews,
    };
  }
}