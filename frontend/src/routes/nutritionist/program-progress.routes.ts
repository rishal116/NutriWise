const NUTRITIONIST_PROGRAM_PROGRESS_BASE =
  "/api/nutritionists/program-progress";

export const NUTRITIONIST_PROGRAM_PROGRESS_ROUTES = {
  OVERVIEW: (clientId: string, userProgramId: string) =>
    `${NUTRITIONIST_PROGRAM_PROGRESS_BASE}/clients/${clientId}/programs/${userProgramId}/progress`,

  DAYS: (clientId: string, userProgramId: string) =>
    `${NUTRITIONIST_PROGRAM_PROGRESS_BASE}/clients/${clientId}/programs/${userProgramId}/progress/days`,

  DAY_ACTIVITIES: (
    clientId: string,
    userProgramId: string,
    dayNumber: number,
  ) =>
    `${NUTRITIONIST_PROGRAM_PROGRESS_BASE}/clients/${clientId}/programs/${userProgramId}/progress/days/${dayNumber}/activities`,
} as const;