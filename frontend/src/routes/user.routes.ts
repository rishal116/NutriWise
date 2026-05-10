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
    SWITCH_ROLE: "/switch-role", //
    REFRESH_TOKEN: "/refresh-token",
  },

  CLIENT_PROFILE: {
    CREATE: "/client-profile",
    GET_ME: "/client-profile/me",
    UPDATE: "/client-profile/me",
    COMPLETE: "/client-profile/me/completion",
    DELETE: "/client-profile/me",
  },

  CHECKOUT: {
    CREATE_SESSION: "/checkout/session",
  },

  HEALTH: {
    GET: "/health-details",
    SAVE: "/health-details",
  },
} as const;