import { SessionStatus, SessionType } from "../../models/session.model";

export interface CreateSessionDTO {
  title: string;
  description?: string;
  type: SessionType;
  price?: number;
  scheduledAt: string;
  durationInMinutes: number;
  maxParticipants?: number;
}

export interface SessionResponseDTO {
  id: string;
  title: string;
  description?: string;
  type: SessionType;
  roomId: string;
  price: number;
  scheduledAt: Date;
  durationInMinutes: number;
  status: SessionStatus;
  maxParticipants: number;
  createdAt: Date;
}
