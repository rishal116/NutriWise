import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import type { IAdminResourceController } from "../../controllers/interfaces/admin/IAdminResourceController";

const router = Router();

const adminResourceController = container.get<IAdminResourceController>(
  TYPES.IAdminResourceController,
);

router.get("/", adminResourceController.getResources);

router.delete("/:resourceId", adminResourceController.deleteResource);

export default router;