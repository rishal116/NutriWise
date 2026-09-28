import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import { IReviewController } from "../../interfaces/user/IReviewController";
import { IReviewService } from "../../../services/interfaces/user/discovery/IReviewService";

import { CreateReviewDTO } from "../../../dtos/user/review/create-review.dto";
import { UpdateReviewDTO } from "../../../dtos/user/review/update-review.dto";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject(TYPES.IReviewService)
    private readonly _reviewService: IReviewService,
  ) {}

  createReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { nutritionistId } = req.params;

    const dto = req.body as CreateReviewDTO;

    const data = await this._reviewService.createReview(
      userId,
      nutritionistId,
      dto,
    );

    res.status(StatusCode.CREATED).json({
      success: true,
      message: "Review created successfully.",
      data,
    });
  });

  getMyReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { userPlanId } = req.params;

    const data = await this._reviewService.getMyReview(userId, userPlanId);

    res.status(StatusCode.OK).json({
      success: true,
      data,
    });
  });

  getNutritionistReviews = asyncHandler(async (req: Request, res: Response) => {
    const { nutritionistId } = req.params;

    const data =
      await this._reviewService.getNutritionistReviews(nutritionistId);

    res.status(StatusCode.OK).json({
      success: true,
      data,
    });
  });

  updateReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { reviewId } = req.params;

    const dto = req.body as UpdateReviewDTO;

    const data = await this._reviewService.updateReview(userId, reviewId, dto);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Review updated successfully.",
      data,
    });
  });

  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { reviewId } = req.params;

    await this._reviewService.deleteReview(userId, reviewId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Review deleted successfully.",
    });
  });
}
