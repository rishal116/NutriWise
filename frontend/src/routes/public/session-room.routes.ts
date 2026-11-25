const SESSION_ROOM_BASE = "/api/session-room";

export const SESSION_ROOM_ROUTES = {
  DETAILS: (roomId: string) => `${SESSION_ROOM_BASE}/${roomId}/details`,
  JOIN: (roomId: string) => `${SESSION_ROOM_BASE}/${roomId}/join`,
  START: (roomId: string) => `${SESSION_ROOM_BASE}/${roomId}/start`,
  END: (roomId: string) => `${SESSION_ROOM_BASE}/${roomId}/end`,
} as const;
