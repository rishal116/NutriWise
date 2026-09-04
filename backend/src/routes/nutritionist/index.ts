import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { authorize } from "../../middlewares/role.middleware";

import { UserRole } from "../../enums/user.enum";

import applicationRoutes from "./application.route";
import planRoutes from "./plan.route";
import meetingRoutes from "./meeting.route";
import groupRoutes from "./group.route";
import clientRoutes from "./client.route";
import programRoutes from "./program.route";
import programDayRoutes from "./program-day.route";
import resourceRoutes from "./resource.route";
import sessionRoutes from "./session.route";

const router = Router();

router.use("/application", applicationRoutes);

router.use(authMiddleware);

router.use(authorize(UserRole.NUTRITIONIST));

router.use("/plans", planRoutes);

router.use("/clients", clientRoutes);

router.use("/programs", programRoutes);

router.use("/program-days", programDayRoutes);

router.use("/meetings", meetingRoutes);

router.use("/groups", groupRoutes);

router.use("/resources", resourceRoutes);

router.use("/sessions", sessionRoutes);

export default router;
