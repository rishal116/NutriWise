import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IStripeWebhookController } from "../../controllers/interfaces/common/IStripeWebhookController";

const router = Router();

const stripeWebhookController = container.get<IStripeWebhookController>(
  TYPES.IStripeWebhookController,
);

router.post("/webhook", stripeWebhookController.handle);

export default router;
