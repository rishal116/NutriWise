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

  getMySessions: async ({
    page = 1,
    limit = 10,
    status,
    type,
    search,
    sortBy = "scheduledAt",
    sortOrder = "desc",
  }: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<PaginatedSessionResponse> => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);

    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (search) params.set("search", search);

    const res = await api.get(`/nutritionist/sessions?${params.toString()}`);

    return res.data;
  },

  getSessionDetails: async (
    sessionId: string,
  ): Promise<{ success: boolean; message: string; data: Session }> => {
    const res = await api.get(`/nutritionist/sessions/${sessionId}`);
    return res.data;
  },

  startSession: async (sessionId: string): Promise<ActionResponse> => {
    const res = await api.patch(`/nutritionist/sessions/${sessionId}/start`);
    return res.data;
  },

  endSession: async (sessionId: string): Promise<ActionResponse> => {
    const res = await api.patch(`/nutritionist/sessions/${sessionId}/end`);
    return res.data;
  },

  cancelSession: async (sessionId: string): Promise<ActionResponse> => {
    const res = await api.patch(`/nutritionist/sessions/${sessionId}/cancel`);
    return res.data;
  },
};
