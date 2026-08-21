const NUTRITIONIST_BASE = "/api/nutritionists/resources";

export const NUTRITIONIST_RESOURCE_ROUTES = {
  LIST: NUTRITIONIST_BASE,

  DETAILS: (resourceId: string) =>
    `${NUTRITIONIST_BASE}/${resourceId}`,

  UPDATE: (resourceId: string) =>
    `${NUTRITIONIST_BASE}/${resourceId}`,

  PUBLISH: (resourceId: string) =>
    `${NUTRITIONIST_BASE}/${resourceId}/publish`,

  ARCHIVE: (resourceId: string) =>
    `${NUTRITIONIST_BASE}/${resourceId}/archive`,
} as const;