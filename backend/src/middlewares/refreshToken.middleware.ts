import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";
import { generateTokens, setAuthCookies } from "../utils/jwt";
import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { StatusCode } from "../enums/statusCode.enum";

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "No refresh token found" });
    }
    const decoded = jwt.verify(token, jwtConfig.refreshToken.secret) as {
      userId: string;
      role: string;
    };
    const user = await UserModel.findById(decoded.userId);
    if (!user) throw new Error("User not found");
    const { accessToken, refreshToken } = generateTokens(
      decoded.userId,
      decoded.role,
    );
    setAuthCookies(res, refreshToken);
    return res
      .status(StatusCode.OK)
      .json({ success: true, accessToken, role: decoded.role });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return res.status(StatusCode.FORBIDDEN).json({ message: "Refresh token expired" });
    }
    return res.status(StatusCode.FORBIDDEN).json({ message: "Invalid refresh token" });
  }
};
