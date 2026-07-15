const ADMIN_BASE = "/api/admin";

export const ADMIN_NUTRITIONIST_ROUTES = {
  NUTRITIONISTS: `${ADMIN_BASE}/nutritionists`,

  DETAILS: (userId: string) =>
    `${ADMIN_BASE}/nutritionists/${userId}`,

  COACH_LEVEL: (userId: string) =>
    `${ADMIN_BASE}/nutritionists/${userId}/coach-level`,
} as const;