export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/signup",
    LOGIN: "/login",
    LOGOUT: "/logout",
    VERIFY_OTP: "/verify-otp",
    RESEND_OTP: "/resend-otp",
    GOOGLE_SIGNUP: "/google",
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

  POSTS: {
    GET_ALL: "/posts",
    GET_MINE: "/posts/me",
    CREATE: "/post",
    GET_BY_ID: (id: string) => `/post/${id}`,
    UPDATE: (id: string) => `/post/${id}`,
    DELETE: (id: string) => `/post/${id}`,
    TOGGLE_LIKE: (id: string) => `/post/${id}/like`,
    GET_COMMENTS: (id: string) => `/post/${id}/comments`,
  },

  COMMENTS: {
    CREATE: "/comment",
    DELETE: (id: string) => `/comment/${id}`,
  },

  CHALLENGES: {
    GET_ALL: "/challenges",
    GET_FEATURED: "/challenges/featured",
    GET_MY_CHALLENGES: "/challenges/user/me",
    GET_BY_SLUG: (slug: string) => `/challenges/slug/${slug}`,
    JOIN: (id: string) => `/challenges/${id}/join`,
    GET_BY_ID: (id: string) => `/challenges/${id}`,
    GET_TASKS: (id: string) => `/challenges/${id}/tasks`,
  },
} as const;