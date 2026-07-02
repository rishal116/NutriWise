import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { jwtConfig } from "../configs/jwt";
import { UserRole } from "../enums/userRole.enum";

export const generateTokens = (userId: string, activeRole: UserRole) => {
  const payload = {
    userId,
    activeRole,
  };

  const accessToken = jwt.sign(payload, jwtConfig.accessToken.secret, {
    expiresIn: jwtConfig.accessToken.expiresIn,
  } as SignOptions);

  const refreshToken = jwt.sign(payload, jwtConfig.refreshToken.secret, {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  } as SignOptions);

  return {
    accessToken,
    refreshToken,
  };
};

export const setAuthCookies = (res: Response, refreshToken: string): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: jwtConfig.refreshToken.cookieMaxAge,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};
