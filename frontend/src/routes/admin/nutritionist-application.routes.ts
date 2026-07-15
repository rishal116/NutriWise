const ADMIN_BASE = "/api/admin";

export const ADMIN_NUTRITIONIST_APPLICATION_ROUTES = {
  APPLICATIONS: `${ADMIN_BASE}/nutritionist-applications`,

  STATUS: (userId: string) =>
    `${ADMIN_BASE}/nutritionist-applications/${userId}/status`,
} as const;