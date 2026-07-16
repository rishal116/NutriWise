import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { INutritionistSubscriptionController } from "../../controllers/interfaces/nutritionist/INutritionistSubscriptionController";

const router = Router();

const controller = container.get<INutritionistSubscriptionController>(
  TYPES.INutritionistSubscriptionController,
);

router.get("/", controller.getSubscriptions);

router.get("/subscribers", controller.getSubscribers);

export default router;
