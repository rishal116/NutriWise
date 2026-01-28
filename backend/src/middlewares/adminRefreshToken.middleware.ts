import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { generateTokens, setAdminAuthCookies } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

export const adminRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.adminRefreshToken;

    if (!token) {
      return res.status(401).json({ message: "No admin refresh token found" });
    }

    const decoded = jwt.verify(
      token,
      jwtConfig.refreshToken.secret
    ) as { userId: string; role: string };

    // 🔐 IMPORTANT: role check
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    const { accessToken, refreshToken } = generateTokens(
      decoded.userId,
      decoded.role
    );

    setAdminAuthCookies(res, refreshToken);

    return res.status(200).json({
      success: true,
      accessToken,
      role: decoded.role,
    });
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Admin refresh token expired" });
    }
    return res.status(403).json({ message: "Invalid admin refresh token" });
  }
};
