import { Router } from "express";

import { container } from "../../configs/inversify";

import { TYPES } from "../../types/types";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { ISessionRegistrationController } from "../../controllers/interfaces/public/ISessionRegistrationController";

const router = Router();

const sessionRegistrationController =
  container.get<ISessionRegistrationController>(
    TYPES.ISessionRegistrationController,
  );

router.post(
  "/:sessionId/register",
  authMiddleware,
  sessionRegistrationController.registerForSession,
);

router.get(
  "/:sessionId/registration",
  authMiddleware,
  sessionRegistrationController.getMySessionRegistration,
);

router.patch(
  "/:sessionId/registration/cancel",
  authMiddleware,
  sessionRegistrationController.cancelSessionRegistration,
);

export default router;
