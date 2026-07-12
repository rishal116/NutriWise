import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { jwtConfig } from "../configs/jwt.config";
import { UserRole } from "../enums/user.enum";

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

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: jwtConfig.accessToken.cookieMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: jwtConfig.refreshToken.cookieMaxAge,
  });
};

export const clearAuthCookies = (res: Response): void => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("none" as const)
        : ("lax" as const),
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};
