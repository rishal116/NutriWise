const ADMIN_BASE = "/api/admin";

export const ADMIN_USER_ROUTES = {
  USERS: `${ADMIN_BASE}/users`,

  USER_DETAILS: (userId: string) =>
    `${ADMIN_BASE}/users/${userId}`,

  BLOCK_STATUS: (userId: string) =>
    `${ADMIN_BASE}/users/${userId}/block-status`,
} as const;