import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { ROLES } from "../constants/index";
import { container } from "../configs/inversify";
import { INutriMeetingsController } from "../controllers/interfaces/nutritionist/INutriMeetingsController";
import { TYPES } from "../types/types";




const router = express.Router();
const nutritionistMeetingsController = container.get<INutriMeetingsController>(TYPES.INutriMeetingsController)
router.get("/meetings",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistMeetingsController.getMeetings)
router.post("/meetings",authMiddleware,authorize(ROLES.NUTRITIONIST),nutritionistMeetingsController.createMeeting)
router.patch("/meetings/status/:roomId",authMiddleware,nutritionistMeetingsController.updateMeetingStatus)

export default router;