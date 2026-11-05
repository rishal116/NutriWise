export const AUTH_MESSAGES = {
  ACCESS_TOKEN_MISSING: "Access token missing",
  TOKEN_EXPIRED: "Access token expired",
  INVALID_TOKEN: "Invalid access token",
  INVALID_ROLE: "Invalid active role",
  USER_NOT_FOUND: "User not found",
  USER_BLOCKED: "User is blocked",

  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",

  SIGNUP_SUCCESS: "Account created successfully",
  OTP_RESENT_SUCCESS: "OTP resent successfully",
  OTP_VERIFIED_SUCCESS: "OTP verified successfully",
  PASSWORD_RESET_OTP_SENT: "Password reset OTP sent successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",

  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  ROLE_SWITCH_SUCCESS: "Role switched successfully",
} as const;
