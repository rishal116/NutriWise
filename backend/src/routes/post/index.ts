import { Router } from "express";
import postLikeRoutes from "./postLike.routes";
import postCommentRoutes from "./postComment.routes";
import postViewRoutes from "./postView.routes";

const router = Router();

router.use("/", postLikeRoutes);
router.use("/", postCommentRoutes);
router.use("/", postViewRoutes);

export default router;