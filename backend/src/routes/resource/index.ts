import { Router } from "express";

import resourceLikeRoutes from "./resourceLike.routes";
import resourceCommentRoutes from "./resourceComment.routes";
import resourceViewRoutes from "./resourceView.routes";

const router = Router();

router.use("/", resourceLikeRoutes);
router.use("/", resourceCommentRoutes);
router.use("/", resourceViewRoutes);

export default router;
