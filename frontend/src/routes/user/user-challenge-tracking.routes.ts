const USER_BASE = "/api/users";

export const USER_CHALLENGE_TRACKING_ROUTES = {
  COMPLETE_ACTIVITY: (
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ) =>
    `${USER_BASE}/challenges/${userChallengeId}/days/${challengeDayId}/activities/${activityId}/complete`,

  UNCOMPLETE_ACTIVITY: (
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ) =>
    `${USER_BASE}/challenges/${userChallengeId}/days/${challengeDayId}/activities/${activityId}/complete`,
} as const;