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

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const payload = jwt.verify(token, jwtConfig.accessToken.secret) as JwtPayload;
    return payload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const payload = jwt.verify(token, jwtConfig.refreshToken.secret) as JwtPayload;
    return payload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

export const setAuthCookies = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};