export const NUTRITIONIST_ROUTES = {
  BASE: "/nutritionist",

  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    LOGOUT: "/logout",
  },

  PROFILE: {
    GET_ME: "/profile",
    UPDATE: "/profile",
  },

  PLANS: {
    CREATE: "/plans",
    GET_ALL: "/plans",
    GET_ONE: "/plans/:planId",
    UPDATE: "/plans/:planId",
    DELETE: "/plans/:planId",
  },

  SUBSCRIPTIONS: {
    GET_ALL: "/subscriptions",
    GET_ONE: "/subscriptions/:subscriptionId",
  },
} as const;
