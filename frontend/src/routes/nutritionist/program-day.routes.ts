const NUTRITIONIST_BASE = "/api/nutritionists";

export const NUTRITIONIST_PROGRAM_DAY_ROUTES = {
  LIST: (programId: string) =>
    `${NUTRITIONIST_BASE}/programs/${programId}/days`,

  CREATE: (programId: string) =>
    `${NUTRITIONIST_BASE}/programs/${programId}/days`,

  DETAILS: (dayId: string) =>
    `${NUTRITIONIST_BASE}/program-days/${dayId}`,

  UPDATE: (dayId: string) =>
    `${NUTRITIONIST_BASE}/program-days/${dayId}`,

  DELETE: (dayId: string) =>
    `${NUTRITIONIST_BASE}/program-days/${dayId}`,
} as const;