export const USER_ROUTES = {
  BASE: "/",

  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    LOGOUT: "/logout",
    RESEND_OTP: "/resend-otp",
    VERIFY_OTP: "/verify-otp",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    UPLOAD_IMAGE: "/profile/image",
  },

  HEALTH: {
    GET: "/health-details",
    UPSERT: "/health-details",
  },

  PLANS: {
    GET_ALL: "/plans",
    GET_ONE: "/plans/:planId",
  },

  CHECKOUT: {
    CREATE: "/checkout",
  },
} as const;
