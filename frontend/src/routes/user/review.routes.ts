const USER_BASE = "/api/users";

export const REVIEW_ROUTES = {
  CREATE: (nutritionistId: string) => `${USER_BASE}/reviews/${nutritionistId}`,

  MY_REVIEW: (userPlanId: string) => `${USER_BASE}/reviews/my/${userPlanId}`,

  NUTRITIONIST_REVIEWS: (nutritionistId: string) =>
    `${USER_BASE}/reviews/nutritionist/${nutritionistId}`,

  UPDATE: (reviewId: string) => `${USER_BASE}/reviews/${reviewId}`,

  DELETE: (reviewId: string) => `${USER_BASE}/reviews/${reviewId}`,
} as const;
