import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { generateTokens, setAdminAuthCookies } from "../utils/jwt";
import { Request, Response } from "express";
import { ROLES } from "../constants";
import { StatusCode } from "../enums/statusCode.enum";

export const adminRefreshToken = async (
  req: Request,
  res: Response,
) => {
  try {
    const token = req.cookies.adminRefreshToken;

    if (!token) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "No admin refresh token found" });
    }

    const decoded = jwt.verify(
      token,
      jwtConfig.refreshToken.secret
    ) as { userId: string; role: string };
    

    if (decoded.role !== ROLES.ADMIN) {
      return res.status(StatusCode.FORBIDDEN).json({ message: "Not authorized as admin" });
    }

    const { accessToken, refreshToken } = generateTokens(
      decoded.userId,
      decoded.role
    );

    setAdminAuthCookies(res, refreshToken);
    
    

    return res.status(StatusCode.OK).json({
      success: true,
      accessToken,
      role: decoded.role,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "Admin refresh token expired" });
    }
    return res.status(StatusCode.UNAUTHORIZED).json({ message: "Invalid admin refresh token" });
  }
};
