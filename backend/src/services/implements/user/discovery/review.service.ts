import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../types/types";

import { IReviewService } from "../../../interfaces/user/discovery/IReviewService";

import { IReviewRepository } from "../../../../repositories/interfaces/user/discovery/IReviewRepository";

import { IUserPlanRepository } from "../../../../repositories/interfaces/user/program/IUserPlanRepository";

import { INutritionistProfileRepository } from "../../../../repositories/interfaces/nutritionist/INutriProfileRepository";

import { CreateReviewDTO } from "../../../../dtos/user/review/create-review.dto";

import { UpdateReviewDTO } from "../../../../dtos/user/review/update-review.dto";

import {
  ReviewResponseDTO,
  PublicReviewResponseDTO,
} from "../../../../dtos/user/review/review-response.dto";

import { ReviewMapper } from "../../../../mappers/user/review/review.mapper";

import { CustomError } from "../../../../utils/customError";

import { StatusCode } from "../../../../enums/statusCode.enum";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.IReviewRepository)
    private readonly _reviewRepository: IReviewRepository,

    @inject(TYPES.IUserPlanRepository)
    private readonly _userPlanRepository: IUserPlanRepository,

    @inject(TYPES.INutritionistProfileRepository)
    private readonly _nutritionistProfileRepository: INutritionistProfileRepository,
  ) { }

  async createReview(
    userId: string,
    nutritionistId: string,
    dto: CreateReviewDTO,
  ): Promise<ReviewResponseDTO> {
    const userPlan = await this._userPlanRepository.findById(dto.userPlanId);

    if (!userPlan) {
      throw new CustomError("User plan not found.", StatusCode.NOT_FOUND);
    }

    if (userPlan.userId.toString() !== userId) {
      throw new CustomError(
        "You are not allowed to review this plan.",
        StatusCode.FORBIDDEN,
      );
    }

    if (userPlan.nutritionistId.toString() !== nutritionistId) {
      throw new CustomError(
        "This plan does not belong to this nutritionist.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (userPlan.paymentStatus !== "paid") {
      throw new CustomError(
        "You can review only a paid plan.",
        StatusCode.BAD_REQUEST,
      );
    }

    const existingReview = await this._reviewRepository.findByUserPlan(
      dto.userPlanId,
    );

    if (existingReview) {
      throw new CustomError(
        "You have already reviewed this plan.",
        StatusCode.CONFLICT,
      );
    }

    const review = await this._reviewRepository.create({
      user: new Types.ObjectId(userId),
      nutritionist: new Types.ObjectId(nutritionistId),
      userPlan: new Types.ObjectId(dto.userPlanId),
      rating: dto.rating,
      review: dto.review,
      isDeleted: false,
    });

    await this._syncNutritionistRating(nutritionistId);

    return ReviewMapper.toResponseDTO(review);
  }

  async getMyReview(
    userId: string,
    userPlanId: string,
  ): Promise<ReviewResponseDTO | null> {
    const review = await this._reviewRepository.findByUserPlan(userPlanId);

    if (!review || review.isDeleted) {
      return null;
    }

    if (review.user.toString() !== userId) {
      throw new CustomError(
        "You are not allowed to access this review.",
        StatusCode.FORBIDDEN,
      );
    }

    return ReviewMapper.toResponseDTO(review);
  }

  async getNutritionistReviews(
    nutritionistId: string,
  ): Promise<PublicReviewResponseDTO[]> {
    const reviews =
      await this._reviewRepository.findByNutritionist(nutritionistId);

    return reviews.map((review) => ReviewMapper.toPublicResponseDTO(review));
  }

  async updateReview(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDTO,
  ): Promise<ReviewResponseDTO> {
    if (dto.rating === undefined && dto.review === undefined) {
      throw new CustomError(
        "At least one field is required.",
        StatusCode.BAD_REQUEST,
      );
    }

    const existingReview = await this._reviewRepository.findById(reviewId);

    if (!existingReview) {
      throw new CustomError("Review not found.", StatusCode.NOT_FOUND);
    }

    if (existingReview.user.toString() !== userId) {
      throw new CustomError(
        "You are not allowed to update this review.",
        StatusCode.FORBIDDEN,
      );
    }

    if (existingReview.isDeleted) {
      throw new CustomError(
        "Deleted reviews cannot be updated.",
        StatusCode.BAD_REQUEST,
      );
    }

    const updateData = {
      ...(dto.rating !== undefined && {
        rating: dto.rating,
      }),
      ...(dto.review !== undefined && {
        review: dto.review,
      }),
    };

    const updatedReview = await this._reviewRepository.updateById(
      reviewId,
      updateData,
    );

    if (!updatedReview) {
      throw new CustomError(
        "Failed to update review.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    await this._syncNutritionistRating(existingReview.nutritionist.toString());

    return ReviewMapper.toResponseDTO(updatedReview);
  }

  async deleteReview(
    userId: string,
    reviewId: string,
  ): Promise<void> {
    const existingReview =
      await this._reviewRepository.findById(reviewId);

    if (!existingReview) {
      throw new CustomError(
        "Review not found.",
        StatusCode.NOT_FOUND,
      );
    }

    if (existingReview.user.toString() !== userId) {
      throw new CustomError(
        "You are not allowed to delete this review.",
        StatusCode.FORBIDDEN,
      );
    }

    const deleted = await this._reviewRepository.deleteOne({
      _id: reviewId,
    });

    if (!deleted) {
      throw new CustomError(
        "Failed to delete review.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    await this._syncNutritionistRating(
      existingReview.nutritionist.toString(),
    );
  }
  
  private async _syncNutritionistRating(
    nutritionistId: string,
  ): Promise<void> {
    const summary =
      await this._reviewRepository.getRatingSummary(nutritionistId);

    console.log("SYNC nutritionistId:", nutritionistId);
    console.log("SYNC summary:", summary);

    const updatedProfile =
      await this._nutritionistProfileRepository.updateRatingSummary(
        nutritionistId,
        summary.averageRating,
        summary.totalReviews,
      );

    console.log("SYNC updatedProfile:", {
      id: updatedProfile?._id,
      userId: updatedProfile?.userId,
      rating: updatedProfile?.rating,
      totalReviews: updatedProfile?.totalReviews,
    });

    if (!updatedProfile) {
      throw new CustomError(
        "Nutritionist profile not found.",
        StatusCode.NOT_FOUND,
      );
    }
  }
}
