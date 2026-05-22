import express from "express";
import { getToken } from "../controllers/implementations/common/livekit.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/token",authMiddleware,getToken);

export default router;