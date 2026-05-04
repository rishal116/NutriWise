import { api } from "@/lib/axios/api";
import {
  CreateSessionPayload,
  PaginatedSessionResponse,
  Session,
  ActionResponse,
} from "@/dtos/nutritionist/session.dto";

export const nutriSessionService = {
  createSession: async (
    data: CreateSessionPayload,
  ): Promise<{ success: boolean; data: Session }> => {
    const res = await api.post("/nutritionist/sessions", data);
    return res.data;
  },

  getMySessions: async (
    page = 1,
    limit = 10,
  ): Promise<PaginatedSessionResponse> => {
    const res = await api.get(
      `/nutritionist/sessions?page=${page}&limit=${limit}`,
    );
    return res.data;
  },

  // 🔍 Get Single Session (for Manage page)
  getSessionDetails: async (
    sessionId: string,
  ): Promise<{ success: boolean; data: Session }> => {
    const res = await api.get(`/nutritionist/sessions/${sessionId}`);
    return res.data;
  },

  // ▶️ Start Session
  startSession: async (sessionId: string): Promise<ActionResponse> => {
    const res = await api.patch(`/nutritionist/sessions/${sessionId}/start`);
    return res.data;
  },

  // ⏹ End Session
  endSession: async (sessionId: string): Promise<ActionResponse> => {
    const res = await api.patch(`/nutritionist/sessions/${sessionId}/end`);
    return res.data;
  },

  // ❌ Cancel Session
  cancelSession: async (sessionId: string): Promise<ActionResponse> => {
    const res = await api.patch(`/nutritionist/sessions/${sessionId}/cancel`);
    return res.data;
  },
};
