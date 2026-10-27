import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IPublicResourceController } from "../../controllers/interfaces/public/IPublicResourceController";
import { optionalAuthMiddleware } from "../../middlewares/optionalAuth.middleware";

const router = Router();

const controller = container.get<IPublicResourceController>(
  TYPES.IPublicResourceController,
);

router.get("/", optionalAuthMiddleware, controller.getPublicResources);

router.get(
  "/:resourceId",
  optionalAuthMiddleware,
  controller.getPublicResourceDetails,
);

export default router;
