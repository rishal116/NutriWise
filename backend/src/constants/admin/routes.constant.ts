export const ADMIN_ROUTES = {
  BASE: "/admin",

  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
  },

  USERS: {
    GET_ALL: "/users",
    BLOCK: "/block-user/:userId",
    UNBLOCK: "/unblock-user/:userId",
  },

  NUTRITIONISTS: {
    GET_ALL: "/nutritionists",
    GET_ONE: "/nutritionist/:userId",
    APPROVE: "/nutritionist/approve/:userId",
    REJECT: "/nutritionist/reject/:userId",
    UPDATE_LEVEL: "/nutritionist/:userId/level",
  },

  NOTIFICATIONS: {
    GET_ALL: "/notifications",
    MARK_READ: "/notifications/read/:id",
  },

  PLANS: {
    GET_ALL: "/plans",
    PUBLISH: "/plans/:planId/publish",
  },
} as const;
