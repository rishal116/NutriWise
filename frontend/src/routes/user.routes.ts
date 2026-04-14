export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/signup",
    LOGIN: "/login",
    LOGOUT: "/logout",
    VERIFY_OTP: "/verify-otp",
    RESEND_OTP: "/resend-otp",
    GOOGLE_SIGNUP: "/google",
    GOOGLE_SIGNIN: "/google-signin",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    ME: "/me",
  },
  CHECKOUT: {
    CREATE_SESSION: "/checkout/session",
  },
  HEALTH: {
    GET: "/health-details",
    SAVE: "/health-details",
  },
} as const;
