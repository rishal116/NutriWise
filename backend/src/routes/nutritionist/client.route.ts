import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { INutriClientController } from "../../controllers/interfaces/nutritionist/INutriClientController";

const router = Router();

const controller = container.get<INutriClientController>(
  TYPES.INutriClientController,
);

router.get("/", controller.getClients);

router.get("/meeting-eligible", controller.getMeetingEligibleClients);

router.get("/:clientId", controller.getClientDetails);

export default router;
