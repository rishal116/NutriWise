const NOTIFICATION_BASE = "/api/notifications";

export const NOTIFICATION_ROUTES = {
  LIST: NOTIFICATION_BASE,
  UNREAD_COUNT: `${NOTIFICATION_BASE}/unread-count`,
  MARK_AS_READ: (notificationId: string) =>
    `${NOTIFICATION_BASE}/${notificationId}/read`,
  MARK_ALL_AS_READ: `${NOTIFICATION_BASE}/read-all`,
} as const;
