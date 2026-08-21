import express from "express";

import conversationRoutes from "./conversation.route";
import messageRoutes from "./message.route";

const router = express.Router();

router.use("/conversations", conversationRoutes);
router.use("/messages", messageRoutes);

export default router;
