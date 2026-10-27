const RESOURCE_BASE = "/api/public/resources";

export const PUBLIC_RESOURCE_ROUTES = {
  LIST: RESOURCE_BASE,

  DETAILS: (resourceId: string) => `${RESOURCE_BASE}/${resourceId}`,
} as const;
