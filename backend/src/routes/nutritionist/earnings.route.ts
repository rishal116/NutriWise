import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { INutriEarningsController } from "../../controllers/interfaces/nutritionist/INutriEarningsController";

const router = Router();

const controller = container.get<INutriEarningsController>(
  TYPES.INutriEarningsController,
);

router.get("/summary", controller.getSummary);

router.get("/transactions", controller.getTransactions);

router.get("/payments", controller.getPayments);

export default router;
