import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IReviewService } from "../../interfaces/user/IReviewService";
import { IReviewRepository } from "../../../repositories/interfaces/user/IReviewRepository";
import {
  SubmitReviewDTO,
  ReviewResponseDTO,
} from "../../../dtos/user/review.dto";
import { Types } from "mongoose";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.IReviewRepository)
    private _reviewRepo: IReviewRepository
  ) {}

  async submitReview(data: SubmitReviewDTO): Promise<ReviewResponseDTO> {
    const { userId, nutritionistId, rating, review, planId } = data;

    // 🔒 Validation
    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // 🔍 Check existing review
    const existing = await this._reviewRepo.findByUser(
      userId,
      nutritionistId,
      planId
    );

    let saved;

    if (existing) {
      // ✏️ Update
      saved = await this._reviewRepo.update(existing._id.toString(), {
        rating,
        review,
      });
    } else {
      // 🆕 Create
      saved = await this._reviewRepo.create({
        user: new Types.ObjectId(userId),
        nutritionist: new Types.ObjectId(nutritionistId),
        ...(planId && { plan: new Types.ObjectId(planId) }),
        rating,
        review,
      });
    }

    if (!saved) throw new Error("Failed to submit review");

    return this.mapToDTO(saved);
  }

  async getMyReview(
    userId: string,
    nutritionistId: string
  ): Promise<ReviewResponseDTO | null> {
    const review = await this._reviewRepo.findByUser(userId, nutritionistId);

    if (!review) return null;

    return this.mapToDTO(review);
  }

  async updateReview(
    reviewId: string,
    data: SubmitReviewDTO
  ): Promise<ReviewResponseDTO> {
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const updated = await this._reviewRepo.update(reviewId, {
      rating: data.rating,
      review: data.review,
    });

    if (!updated) throw new Error("Update failed");

    return this.mapToDTO(updated);
  }

  async deleteReview(reviewId: string): Promise<void> {
    const deleted = await this._reviewRepo.delete(reviewId);

    if (!deleted) throw new Error("Delete failed");
  }

  // 🎯 DTO mapper (VERY IMPORTANT for clean architecture)
  private mapToDTO(review: any): ReviewResponseDTO {
    return {
      id: review._id.toString(),
      userId: review.user.toString(),
      nutritionistId: review.nutritionist?.toString(),
      planId: review.plan?.toString(),
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
    };
  }
}