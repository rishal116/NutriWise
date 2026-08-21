import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { upload } from "../../middlewares/multer.middleware";

import { INutriResourceController } from "../../controllers/interfaces/nutritionist/INutriResourceController";

const router = Router();

const controller = container.get<INutriResourceController>(
  TYPES.INutriResourceController,
);

router.post(
  "/",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  controller.createResource,
);

router.get("/", controller.getResources);

router.get("/:resourceId", controller.getResourceDetails);

router.patch("/:resourceId", controller.updateResource);

router.patch("/:resourceId/publish", controller.publishResource);

router.patch("/:resourceId/archive", controller.archiveResource);

export default router;
