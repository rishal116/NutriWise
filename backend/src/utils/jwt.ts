import jwt, { SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt";
import  { JwtPayload as JWTVerifyPayload } from "jsonwebtoken";


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

export const verifyRefreshToken = (token: string): JWTVerifyPayload => {
  try {
    const payload = jwt.verify(token, jwtConfig.refreshToken.secret) as JWTVerifyPayload;
    return payload;
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
};
