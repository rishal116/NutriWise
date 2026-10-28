import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { IUserPaymentController } from "../../controllers/interfaces/user/IUserPaymentController"; 

import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const controller = container.get<IUserPaymentController>(
  TYPES.IUserPaymentController,
);

router.get("/", authMiddleware, controller.getPayments);

router.get("/wallet", authMiddleware, controller.getWallet);

router.get(
  "/wallet/transactions",
  authMiddleware,
  controller.getWalletTransactions,
);

router.get("/:paymentId", authMiddleware, controller.getPaymentById);

export default router;