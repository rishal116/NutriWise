const MESSAGE_BASE = "/api/chat/messages";

export const MESSAGE_ROUTES = {
  LIST: (conversationId: string) => `${MESSAGE_BASE}/${conversationId}`,

  CREATE: MESSAGE_BASE,

  FILE: `${MESSAGE_BASE}/file`,

  MARK_AS_READ: (conversationId: string) =>
    `${MESSAGE_BASE}/read/${conversationId}`,

  DELETE: (messageId: string) => `${MESSAGE_BASE}/delete/${messageId}`,

  EDIT: (messageId: string) => `${MESSAGE_BASE}/edit/${messageId}`,
} as const;
