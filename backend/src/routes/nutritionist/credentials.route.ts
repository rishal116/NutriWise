import { Router } from "express";

import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";

import { INutriCredentialsController } from "../../controllers/interfaces/nutritionist/INutriCredentialsController";

const router = Router();

const controller = container.get<INutriCredentialsController>(
  TYPES.INutriCredentialsController,
);

router.get("/", controller.getCredentials);

export default router;
