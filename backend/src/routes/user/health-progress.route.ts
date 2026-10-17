import express from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import type { IHealthProgressController } from "../../controllers/interfaces/user/IHealthProgressController";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

const healthProgressController = container.get<IHealthProgressController>(
  TYPES.IHealthProgressController,
);

router.use(authMiddleware);

router.get("/", healthProgressController.getHealthProgress);

router.get("/date", healthProgressController.getProgressByDate);

router.get("/latest", healthProgressController.getLatestProgress);

export default router;
