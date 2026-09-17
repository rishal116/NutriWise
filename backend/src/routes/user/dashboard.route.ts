import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { IUserDashboardController } from "../../controllers/interfaces/user/IUserDashboardController";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

const controller = container.get<IUserDashboardController>(
  TYPES.IUserDashboardController,
);

router.get("/overview", authMiddleware, controller.getOverview);

export default router;
