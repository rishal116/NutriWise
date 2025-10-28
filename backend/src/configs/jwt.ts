import dotenv from "dotenv";
dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are missing in environment variables!");
}

export const jwtConfig = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN as string),
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as string),
  },
};
