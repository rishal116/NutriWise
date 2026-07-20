const USER_BASE = "/api/users";

export const NUTRITIONIST_PLAN_BROWSING_ROUTES = {
  LIST: (username: string) => `${USER_BASE}/nutritionists/${username}/plans`,

  DETAILS: (slug: string) => `${USER_BASE}/nutritionists/plans/${slug}`,
} as const;
