import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IReviewController } from "../../controllers/interfaces/user/IReviewController";

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const reviewController = container.get<IReviewController>(
  TYPES.IReviewController,
);

router.post("/:nutritionistId", authMiddleware, reviewController.createReview);

router.get("/my/:userPlanId", authMiddleware, reviewController.getMyReview);

router.get(
  "/nutritionist/:nutritionistId",
  reviewController.getNutritionistReviews,
);

router.patch("/:reviewId", authMiddleware, reviewController.updateReview);

router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);

export default router;
