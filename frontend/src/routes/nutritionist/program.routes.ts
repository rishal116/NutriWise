const NUTRITIONIST_BASE = "/api/nutritionists";

export const NUTRITIONIST_PROGRAM_ROUTES = {
  LIST: `${NUTRITIONIST_BASE}/programs`,

  DETAILS: (programId: string) =>
    `${NUTRITIONIST_BASE}/programs/${programId}`,
} as const;