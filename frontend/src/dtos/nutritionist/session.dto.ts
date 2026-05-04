export type SessionType = "free" | "paid";

export interface CreateSessionPayload {
  title: string;
  description?: string;
  type: SessionType;
  price?: number;
  scheduledAt: string; // ISO string
  durationInMinutes: number;
  maxParticipants?: number;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  type: SessionType;
  roomId:string;
  price: number;
  scheduledAt: string;
  durationInMinutes: number;
  status: string;
  maxParticipants?: number;
  createdAt: string;
}

export interface PaginatedSessionResponse {
  success: boolean;
  data: Session[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface ActionResponse {
  success: boolean;
  message: string;
}