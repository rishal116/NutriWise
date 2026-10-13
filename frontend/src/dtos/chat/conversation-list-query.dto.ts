import { ConversationListFilter } from "@/types/chat/chat.types"; 

export interface ConversationListQueryDTO {
  limit?: number;
  cursor?: string;
  filter?: ConversationListFilter;
  search?: string;
}