const USER_BASE = "/api/users";

export const NUTRITIONIST_BROWSING_ROUTES = {
  LIST: `${USER_BASE}/nutritionists`,

  STATS: `${USER_BASE}/nutritionists/stats`,

  DETAILS: (username: string) =>
    `${USER_BASE}/nutritionists/${username}`,
} as const;