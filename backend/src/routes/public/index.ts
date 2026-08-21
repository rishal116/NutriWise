import { Router } from "express";

import resourceRoutes from "./resource.route";

const router = Router();

router.use("/resources", resourceRoutes);

export default router;
