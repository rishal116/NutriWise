const NUTRITIONIST_BASE = "/api/nutritionists";

export const NUTRITIONIST_PROGRAM_ROUTES = {
  LIST: `${NUTRITIONIST_BASE}/programs`,

  DETAILS: (programId: string) => `${NUTRITIONIST_BASE}/programs/${programId}`,

  MARK_AS_READY: (programId: string) =>
    `${NUTRITIONIST_BASE}/programs/${programId}/ready`,
} as const;
