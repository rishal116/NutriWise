import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { ResourceViewController } from "../../controllers/implementations/resource/resourceView.controller";

const router = Router();

const resourceViewController = container.get<ResourceViewController>(
  TYPES.IResourceViewController,
);

router.post("/:resourceId/view", resourceViewController.recordView);

export default router;
