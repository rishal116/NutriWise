const ADMIN_BASE = "/api/admin";

export const ADMIN_RESOURCE_ROUTES = {
  LIST: `${ADMIN_BASE}/resources`,
  DELETE: (resourceId: string) =>
    `${ADMIN_BASE}/resources/${resourceId}`,
} as const;