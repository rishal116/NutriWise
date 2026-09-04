import { Router } from "express";

import resourceRoutes from "./resource.route";
import sessionRoutes from "./session.route";
import sessionRegistrationRoutes from "./session-registration.route";

const router = Router();

router.use("/resources", resourceRoutes);

router.use("/sessions", sessionRoutes);

router.use("/sessions", sessionRegistrationRoutes);

export default router;
