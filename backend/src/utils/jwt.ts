import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import { jwtConfig } from "../configs/jwt";
import { UserRole } from "../models/user.model";

export const generateTokens = (
  userId: string,
  activeRole: UserRole,
  roles: UserRole[]
) => {
  const payload = {
    userId,
    activeRole,
    roles,
  };

  const accessToken = jwt.sign(
    payload,
    jwtConfig.accessToken.secret,
    {
      expiresIn: jwtConfig.accessToken.expiresIn,
    } as SignOptions
  );

  const refreshToken = jwt.sign(
    payload,
    jwtConfig.refreshToken.secret,
    {
      expiresIn: jwtConfig.refreshToken.expiresIn,
    } as SignOptions
  );

  return { accessToken, refreshToken };
};

// ─────────────────────────────
// USER COOKIES
// ─────────────────────────────
export const setAuthCookies = (
  res: Response,
  refreshToken: string
): void => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};

// ─────────────────────────────
// ADMIN COOKIES
// ─────────────────────────────
export const setAdminAuthCookies = (
  res: Response,
  refreshToken: string
): void => {
  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAdminAuthCookies = (res: Response): void => {
  res.clearCookie("adminRefreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};