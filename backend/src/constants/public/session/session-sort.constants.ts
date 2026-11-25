export const PUBLIC_SESSION_SORT_CONFIG = {
  all: { field: "createdAt", direction: -1 },
  latest: { field: "createdAt", direction: -1 },
  oldest: { field: "createdAt", direction: 1 },
  upcoming: { field: "scheduledAt", direction: 1 },
  price_low_to_high: { field: "sortPrice", direction: 1 },
  price_high_to_low: { field: "sortPrice", direction: -1 },
} as const;