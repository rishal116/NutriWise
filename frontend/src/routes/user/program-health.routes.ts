const USER_BASE = "/api/users";

export const USER_PROGRAM_HEALTH_ROUTES = {
  CREATE: (programId: string) => `${USER_BASE}/program-health/${programId}`,

  DETAILS: (programId: string) => `${USER_BASE}/program-health/${programId}`,

  UPDATE: (programId: string) => `${USER_BASE}/program-health/${programId}`,
} as const;
