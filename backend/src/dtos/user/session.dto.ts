import { SessionType, SessionStatus } from "../../models/session.model";

export type SessionUserDTO = {
  id: string;
  name: string;
  email: string;
};

export type UserSessionListDTO = {
  id: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  durationInMinutes: number;
  type: SessionType;
  price?: number;
  status: SessionStatus;
  joinedUsersCount: number;
  maxParticipants?: number;
};

export type UserSessionDetailsDTO = {
  id: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  durationInMinutes: number;
  type: SessionType;
  price?: number;
  status: SessionStatus;
  roomId: string;
  joinedUsersCount: number;
  maxParticipants?: number;
  nutritionist: {
    id: string;
    name: string;
    email: string;
  };
  users: {
    id: string;
    name: string;
    email: string;
  }[];
};


export type UserSessionDTO = {
  id: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  durationInMinutes: number;
  type: SessionType;
  price?: number;
  status: SessionStatus;
  joinedUsersCount: number;
  maxParticipants?: number;
};

export type SessionPaymentDTO = {
  checkoutUrl: string;
};

export type SessionAccessDTO = {
  roomId: string;
  sessionId: string;
  token?: string;
};
