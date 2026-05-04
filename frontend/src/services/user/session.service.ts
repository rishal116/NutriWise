import { api } from "@/lib/axios/api";

/* ===================== TYPES ===================== */

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type UserSession = {
  id: string;
  title: string;
  description?: string;

  scheduledAt: string;
  durationInMinutes: number;

  type: "free" | "paid";
  price?: number;

  status: string;

  users: SessionUser[];

  joinStatus: "none" | "pending" | "approved";
};

export type UserSessionResponse = {
  success: boolean;
  data: UserSession[];
};

export type ActionResponse = {
  success: boolean;
  message: string;
};

/* ===================== SERVICE ===================== */

export const userSessionService = {
 
  getSessions: async (): Promise<UserSessionResponse> => {
    const res = await api.get("/sessions");
    console.log(res);
    
    return res.data;
  },

 
  joinSession: async (sessionId: string): Promise<ActionResponse> => {
    const res = await api.post("/sessions/join", {
      sessionId,
    });
    return res.data;
  },

  leaveSession: async (sessionId: string): Promise<ActionResponse> => {
    const res = await api.post("/sessions/leave", {
      sessionId,
    });
    return res.data;
  },
};