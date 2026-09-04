import express from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { ICheckoutController } from "../../controllers/interfaces/user/ICheckoutController";

import { ISessionCheckoutController } from "../../controllers/interfaces/public/ISessionCheckoutController";

const router = express.Router();

const checkoutController = container.get<ICheckoutController>(
  TYPES.ICheckoutController,
);

const sessionCheckoutController = container.get<ISessionCheckoutController>(
  TYPES.ISessionCheckoutController,
);

router.post(
  "/session",
  authMiddleware,
  checkoutController.createCheckoutSession,
);

router.post(
  "/session-registration",
  authMiddleware,
  sessionCheckoutController.createCheckoutSession,
);

export default router;
