const USER_BASE = "/api/users";

export const USER_ACTIVITY_TRACKING_ROUTES = {
  START: (programId: string, dayId: string, activityId: string) =>
    `${USER_BASE}/programs/${programId}/days/${dayId}/activities/${activityId}/start`,

  UPDATE: (programId: string, dayId: string, activityId: string) =>
    `${USER_BASE}/programs/${programId}/days/${dayId}/activities/${activityId}`,

  SKIP: (programId: string, dayId: string, activityId: string) =>
    `${USER_BASE}/programs/${programId}/days/${dayId}/activities/${activityId}/skip`,

  GET_ACTIVITY_TRACKING: (
    programId: string,
    dayId: string,
    activityId: string,
  ) =>
    `${USER_BASE}/programs/${programId}/days/${dayId}/activities/${activityId}/tracking`,

  GET_DAY_ACTIVITIES: (programId: string, dayId: string) =>
    `${USER_BASE}/programs/${programId}/days/${dayId}/activities/tracking`,
} as const;
