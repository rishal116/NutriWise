import { SessionType, SessionStatus } from "../../models/session.model";

export type SessionUserDTO = {
  id: string;
  name: string;
  email: string;
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

  users: SessionUserDTO[];

  joinStatus: "none" | "pending" | "approved";
};