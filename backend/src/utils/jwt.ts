import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { Response } from "express";
import { jwtConfig } from "../configs/jwt";

export const generateTokens = (userId: string, role: string) => {
  const payload = { userId, role };
  
  const accessToken = jwt.sign(
    payload,
    jwtConfig.accessToken.secret,
    { expiresIn: jwtConfig.accessToken.expiresIn } as SignOptions
  );
  
  const refreshToken = jwt.sign(
    payload,
    jwtConfig.refreshToken.secret,
    { expiresIn: jwtConfig.refreshToken.expiresIn } as SignOptions
  );

  return { accessToken, refreshToken };
};


export const setAuthCookies = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

export const setAdminAuthCookies = (res: Response, refreshToken: string) => {
  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};


export const clearAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};

export const clearAdminAuthCookies = (res: Response) => {
  res.clearCookie("adminRefreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
};