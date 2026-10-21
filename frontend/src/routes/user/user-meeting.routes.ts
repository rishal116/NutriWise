const USER_BASE = "/api/users";

export const USER_MEETING_ROUTES = {
  MEETINGS: `${USER_BASE}/meetings`,
  MEETING_DETAILS: (meetingId: string) => `${USER_BASE}/meetings/${meetingId}`,
  CANCEL_MEETING: (meetingId: string) =>
    `${USER_BASE}/meetings/${meetingId}/cancel`,
} as const;
