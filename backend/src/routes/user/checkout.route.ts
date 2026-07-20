import express from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { ICheckoutController } from "../../controllers/interfaces/user/ICheckoutController";

const router = express.Router();

const checkoutController = container.get<ICheckoutController>(
  TYPES.ICheckoutController,
);

router.post(
  "/session",
  authMiddleware,
  checkoutController.createCheckoutSession,
);

export default router;
