const NUTRITIONIST_BASE = "/api/nutritionists";

export const NUTRITIONIST_MEETING_ROUTES = {
  LIST: `${NUTRITIONIST_BASE}/meetings`,

  CREATE: `${NUTRITIONIST_BASE}/meetings`,

  DETAILS: (meetingId: string) => `${NUTRITIONIST_BASE}/meetings/${meetingId}`,

  UPDATE_STATUS: (roomId: string) =>
    `${NUTRITIONIST_BASE}/meetings/status/${roomId}`,
} as const;
