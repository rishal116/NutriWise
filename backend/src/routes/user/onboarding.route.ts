import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { IOnboardingController } from "../../controllers/interfaces/user/IOnboardingController";

const router = Router();

const onboardingController = container.get<IOnboardingController>(
  TYPES.IOnboardingController,
);

router.use(authMiddleware);

router.patch("/", onboardingController.completeProfile);

export default router;