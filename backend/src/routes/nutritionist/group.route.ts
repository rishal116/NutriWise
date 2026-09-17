import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { INutriGroupController } from "../../controllers/interfaces/nutritionist/INutriGroupController";

const router = Router();

const controller = container.get<INutriGroupController>(
  TYPES.INutriGroupController,
);

router.post("/", controller.createGroup);

router.get("/", controller.browseGroups);

router.get("/:groupId", controller.getGroup);

export default router;
