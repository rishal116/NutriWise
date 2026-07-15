import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { IHealthDetailsController } from "../../controllers/interfaces/user/IHealthDetailsController";

const router = Router();

const healthDetailsController = container.get<IHealthDetailsController>(
  TYPES.IHealthDetailsController,
);

router.use(authMiddleware);

router.get("/", healthDetailsController.getHealthDetails);

router.post("/", healthDetailsController.saveHealthDetails);

export default router;
