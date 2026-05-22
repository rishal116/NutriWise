import { Request, Response } from "express";
import logger from "../../../utils/logger";
import { generateToken } from "../../../services/implements/common/livekit.service";

export const getToken = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const roomId = req.query.roomId?.toString();

  // 🔍 Debug logs (safe for development)
  logger.info("[LiveKit] Token request received", {
    userId,
    roomId,
  });

  // ❌ validation
  if (!userId || !roomId) {
    logger.warn("[LiveKit] Missing userId or roomId", {
      userId,
      roomId,
    });

    return res.status(400).json({
      success: false,
      message: "userId and roomId required",
    });
  }

  try {
    // 🔥 generate token
    const token = await generateToken(userId, roomId);
    
    

    logger.info("[LiveKit] Token generated successfully", {
      userId,
      roomId,
    });

    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    logger.error("[LiveKit] Token generation failed", {
      error: error instanceof Error ? error.message : error,
    });

    return res.status(500).json({
      success: false,
      message: "Failed to generate LiveKit token",
    });
  }
};