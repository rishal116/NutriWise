const USER_BASE = "/api/users";

export const USER_PROGRAM_ROUTES = {
  BROWSE: `${USER_BASE}/programs`,

  DETAILS: (programId: string) => `${USER_BASE}/programs/${programId}`,

  DAYS: (programId: string) =>
    `${USER_BASE}/programs/${programId}/days`,

  DAY_DETAILS: (programId: string, dayNumber: number) =>
    `${USER_BASE}/programs/${programId}/days/${dayNumber}`,
} as const;