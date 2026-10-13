import { Router } from "express";
import postLikeRoutes from "./postLike.routes";
import postCommentRoutes from "./postComment.routes";

const router = Router();

router.use("/", postLikeRoutes);
router.use("/", postCommentRoutes);

export default router;
