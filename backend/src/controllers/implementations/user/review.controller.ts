import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import { IReviewController } from "../../interfaces/user/IReviewController";
import { IReviewService } from "../../../services/interfaces/user/IReviewService";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject(TYPES.IReviewService)
    private _reviewService: IReviewService,
  ) {}

  submitReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const { nutritionistId, rating, review, planId } = req.body;
    console.log(req.body);

    // 🚀 Call service
    const data = await this._reviewService.submitReview({
      userId,
      nutritionistId,
      rating,
      review,
      planId,
    });

    res.status(StatusCode.CREATED).json({
      success: true,
      message: "Review submitted successfully",
      data,
    });
  });

  getMyReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { nutritionistId } = req.params;

    const review = await this._reviewService.getMyReview(
      userId,
      nutritionistId,
    );

    res.status(StatusCode.OK).json({ success: true, data: review });
  });

  updateReview = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;

    const updated = await this._reviewService.updateReview(reviewId, req.body);

    res.status(StatusCode.OK).json({ success: true, data: updated });
  });

  deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { reviewId } = req.params;

    await this._reviewService.deleteReview(reviewId);

    res.status(StatusCode.OK).json({ success: true, message: "Deleted" });
  });
}
