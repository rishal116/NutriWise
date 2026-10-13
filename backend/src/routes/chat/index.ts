import express from "express";

import conversationRoutes from "./conversation.route";
import messageRoutes from "./message.route";
import groupRoutes from "./group.route";

const router = express.Router();

router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);
router.use("/groups", groupRoutes);

export default router;
