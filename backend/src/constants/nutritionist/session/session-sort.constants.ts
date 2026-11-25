export const NUTRI_SESSION_SORT_CONFIG = {
  latest: { field: "createdAt", direction: -1 },
  oldest: { field: "createdAt", direction: 1 },
  date_asc: { field: "scheduledAt", direction: 1 },
  date_desc: { field: "scheduledAt", direction: -1 },
} as const;
