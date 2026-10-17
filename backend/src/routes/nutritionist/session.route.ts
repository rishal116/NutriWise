import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import type { INutriSessionController } from "../../controllers/interfaces/nutritionist/INutriSessionController";
import type { INutriSessionRegistrationController } from "../../controllers/interfaces/nutritionist/INutriSessionRegistrationController";

import { upload } from "../../middlewares/multer.middleware";

const router = Router();

const controller = container.get<INutriSessionController>(
  TYPES.INutriSessionController,
);

const registrationController =
  container.get<INutriSessionRegistrationController>(
    TYPES.INutriSessionRegistrationController,
  );

router.post("/", upload.single("thumbnail"), controller.createSession);

router.get("/", controller.getSessions);

router.get(
  "/:sessionId/participants",
  registrationController.getSessionParticipants,
);

router.get("/:sessionId", controller.getSessionDetails);

router.patch(
  "/:sessionId",
  upload.single("thumbnail"),
  controller.updateSession,
);

router.patch("/:sessionId/publish", controller.publishSession);

router.delete("/:sessionId", controller.deleteSession);

export default router;
