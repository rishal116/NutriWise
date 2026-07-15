const USER_BASE = "/api/users";

export const AUTH_ROUTES = {
  SIGNUP: `${USER_BASE}/auth/signup`,
  VERIFY_OTP: `${USER_BASE}/auth/verify-otp`,
  RESEND_OTP: `${USER_BASE}/auth/resend-otp`,

  LOGIN: `${USER_BASE}/auth/login`,
  LOGOUT: `${USER_BASE}/auth/logout`,
  GOOGLE: `${USER_BASE}/auth/google`,

  FORGOT_PASSWORD: `${USER_BASE}/auth/forgot-password`,
  RESET_PASSWORD: `${USER_BASE}/auth/reset-password`,

  REFRESH_TOKEN: `${USER_BASE}/auth/refresh-token`,

  ME: `${USER_BASE}/auth/me`,

  SWITCH_ROLE: `${USER_BASE}/auth/switch-role`,
} as const;