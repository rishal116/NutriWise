import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt";

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (userId: string, role: string) => {
  const payload = { userId, role };

  const accessToken = jwt.sign(payload, jwtConfig.accessToken.secret, {
    expiresIn: jwtConfig.accessToken.expiresIn,
  } as SignOptions);

  const refreshToken = jwt.sign(payload, jwtConfig.refreshToken.secret, {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  } as SignOptions);

  return { accessToken, refreshToken };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const payload = jwt.verify(token, jwtConfig.accessToken.secret) as JwtPayload;
    return payload;
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const payload = jwt.verify(token, jwtConfig.refreshToken.secret) as JwtPayload;
    return payload;
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};
