import { Router } from "express";

import resourceRoutes from "./resource.route";

import sessionRoutes from "./session.route";

import sessionRegistrationRoutes from "./session-registration.route";

import challengeRoutes from "./challenge.route";

import groupRoutes from "./group.route";

const router = Router();

router.use("/resources", resourceRoutes);

router.use("/sessions", sessionRoutes);

router.use("/sessions", sessionRegistrationRoutes);

router.use("/challenges", challengeRoutes);

router.use("/groups", groupRoutes);

export default router;
