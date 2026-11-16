import express from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";

import type { IProgramHealthController } from "../../controllers/interfaces/user/program/IProgramHealthController";

const router = express.Router();

const controller = container.get<IProgramHealthController>(
  TYPES.IProgramHealthController,
);

router.use(authMiddleware);

router.post("/:programId", controller.createProgramHealth);

router.get("/:programId", controller.getProgramHealth);

router.patch("/:programId", controller.updateProgramHealth);

export default router;
