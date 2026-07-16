import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

import { UserRole } from "../../enums/user.enum";

import applicationRoutes from "./application.route";
import planRoutes from "./plan.route";
import meetingRoutes from "./meeting.route";
import programRoutes from "./program.route";
import subscriptionRoutes from "./subscription.route";
import groupRoutes from "./group.route";

const router = Router();
router.use("/application", applicationRoutes);

router.use(authMiddleware);
router.use(authorize(UserRole.NUTRITIONIST));

router.use("/plans", planRoutes);

router.use("/meetings", meetingRoutes);

router.use("/programs", programRoutes);

router.use("/subscriptions", subscriptionRoutes);

router.use("/groups", groupRoutes);

export default router;
