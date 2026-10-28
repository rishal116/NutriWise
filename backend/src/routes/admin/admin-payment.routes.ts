import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { IAdminPaymentController } from "../../controllers/interfaces/admin/IAdminPaymentController";

const router = Router();

const adminPaymentController = container.get<IAdminPaymentController>(
  TYPES.IAdminPaymentController,
);

router.get("/", adminPaymentController.listPayments);

router.get("/count", adminPaymentController.getPaymentCount);

router.get("/statistics", adminPaymentController.getPaymentStatistics);

router.get("/wallets", adminPaymentController.listWallets);

router.get("/wallets/:walletId", adminPaymentController.getWalletDetails);

router.get(
  "/wallets/:walletId/transactions",
  adminPaymentController.listWalletTransactions,
);

router.get("/:paymentId", adminPaymentController.getPaymentDetails);

export default router;