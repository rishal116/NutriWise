import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware";

import { authorize } from "../../middlewares/role.middleware";

import { UserRole } from "../../enums/user.enum";

import userRoutes from "./user.route";

import nutritionistRoutes from "./nutritionist.route";

import nutritionistApplicationRoutes from "./nutritionist-application.route";

import challengeRoutes from "./challenge.route";

const router = Router();

router.use(authMiddleware);

router.use(authorize(UserRole.ADMIN));

router.use("/users", userRoutes);

router.use("/nutritionists", nutritionistRoutes);

router.use("/nutritionist-applications", nutritionistApplicationRoutes);

router.use("/challenges", challengeRoutes);

export default router;
