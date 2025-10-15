
export const jwtConfig = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET || "your_access_secret_here",
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN as string) || "15m",
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret_here",
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as string) || "7d",
  },
};
