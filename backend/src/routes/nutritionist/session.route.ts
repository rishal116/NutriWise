import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { INutriSessionController } from "../../controllers/interfaces/nutritionist/INutriSessionController";

import { upload } from "../../middlewares/multer.middleware";

const router = Router();

const controller = container.get<INutriSessionController>(
  TYPES.INutriSessionController,
);

router.post("/", upload.single("thumbnailUrl"), controller.createSession);

router.get("/", controller.getSessions);

router.get("/:sessionId", controller.getSessionDetails);

router.patch(
  "/:sessionId",
  upload.single("thumbnailUrl"),
  controller.updateSession,
);

router.patch("/:sessionId/publish", controller.publishSession);

router.delete("/:sessionId", controller.deleteSession);

export default router;
