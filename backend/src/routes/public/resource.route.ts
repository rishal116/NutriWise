import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { IPublicResourceController } from "../../controllers/interfaces/public/IPublicResourceController";

const router = Router();

const controller = container.get<IPublicResourceController>(
  TYPES.IPublicResourceController,
);

router.get("/", controller.getPublicResources);

router.get("/:resourceId", controller.getPublicResourceDetails);

router.post("/:resourceId/view", controller.recordResourceView);

router.post("/:resourceId/download", controller.recordResourceDownload);

router.post("/:resourceId/share", controller.recordResourceShare);

export default router;
