const CONVERSATION_BASE = "/api/chat/conversations";

export const CONVERSATION_ROUTES = {
  CREATE: CONVERSATION_BASE,
  LIST: CONVERSATION_BASE,
  DETAILS: (conversationId: string) => `${CONVERSATION_BASE}/${conversationId}`,
} as const;
